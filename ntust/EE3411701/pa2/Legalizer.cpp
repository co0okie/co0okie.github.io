#include "Legalizer.h"
#include <algorithm>
#include <list>
#include <limits>
#include <cmath>
#include <iostream>

#define DEBUG 0

struct Cluster;

struct Row {
    const DEF::Row* row;
    std::list<Cluster> clusters;
    double width;

    Row() {}
    Row(const DEF::Row* row) : row(row), width(row->countX * row->stepX) {}

    bool directlyPlace(Cluster&& cluster);

    double validateLastCluster();
};

struct Cluster {
    std::list<DEF::Component*> cells;
    double sumX = 0, x1, x2;
    const Row* row;

    Cluster(const Row& row);
    Cluster(DEF::Component* const &component, const Row& row);

    void update();
    void addCell(DEF::Component* const &component);
    void combineCluster(Cluster&& other);
};

double cellWidth;

double getCost(const DEF::Component& component, const double& x, const double& y) {
    return std::abs(x - component.x) + std::abs(y - component.y);
}

// placing a block with (left edge ax1, right edge ax2) to nearest point in {bx1 + n * dbx | block is inside (bx1, bx1 + bw)}
// assuming (ax2 - ax1) % dbx == 0, (bx2 - bx1) % dbx == 0, ax1 < ax2, bx1 < bx2, dbx > 0
// return new ax1 value
double validateX(const double& ax1, const double& ax2, const double& bx1, const double& dbx, const double& bx2) {
    if (ax1 < bx1) {
        return bx1;
    } else if (ax2 > bx2) {
        return bx2 - (ax2 - ax1);
    } else {
        return bx1 + std::floor((ax1 - bx1) / dbx) * dbx;
    }
}

// placing cluster directly, return false if overlap, true if not
bool Row::directlyPlace(Cluster&& cluster) {
    const auto& x2 = clusters.back().x2;
    clusters.emplace_back(std::move(cluster));
    return x2 <= clusters.back().x1;
}

double Row::validateLastCluster() {
    auto it = --clusters.end();
    while (clusters.size() >= 2 && clusters.back().x1 < (--it)->x2) {
        if (DEBUG > 2) std::cout << "    cluster overlap with [" << it->x1 << ", " << it->x2 << "], combining..." << std::endl;
        if (it->x2 - it->x1 + clusters.back().x2 - clusters.back().x1 > width) {
            if (DEBUG > 2) std::cout << "    insufficient row width" << std::endl;
            return std::numeric_limits<double>::infinity();
        }
        it->combineCluster(std::move(clusters.back()));
        clusters.pop_back();
        if (DEBUG > 2) std::cout << "    combine complete, new cluster position: [" << it->x1 << ", " << it->x2 << "]" << std::endl;
    }
    return getCost(*clusters.back().cells.back(), clusters.back().x2 - cellWidth, row->y);
}

Cluster::Cluster(const Row& row) : sumX(0), row(&row) {}

Cluster::Cluster(DEF::Component* const &component, const Row& row) : sumX(0), row(&row) {
    cells.push_back(component);
    sumX += component->x;
    x1 = validateX(component->x, component->x + cellWidth, row.row->x, row.row->stepX, row.row->x + row.width);
    x2 = x1 + cellWidth;
}

void Cluster::update() {
    double centerOfMass = sumX / cells.size();
    double halfWidth = cellWidth * (cells.size() - 1) / 2;
    x1 = centerOfMass - halfWidth;
    x2 = centerOfMass + halfWidth + cellWidth;
    x1 = validateX(x1, x2, row->row->x, row->row->stepX, row->row->x + row->width);
    x2 = x1 + 2 * halfWidth + cellWidth;
}

void Cluster::addCell(DEF::Component* const &component) {
    cells.push_back(component);
    sumX += component->x;
    update();
}

void Cluster::combineCluster(Cluster&& other) {
    cells.splice(cells.end(), std::move(other.cells));
    sumX += other.sumX;
    update();
}

// counting interger farther and farther from a value, within 0 ~ max, e.g.
// RowIterator{3.2, 9}:
//     3, 4, 2, 5, 1, 6, 0, 7, 8, 9
// RowIterator{1.7, 9}:
//     2, 1, 3, 0, 4, 5, 6, 7, 8, 9
// RowIterator{6.1, 9}:
//     6, 7, 5, 8, 4, 9, 3, 2, 1, 0
// RowIterator{7.8, 9}:
//     8, 7, 9, 6, 5, 4, 3, 2, 1, 0
struct RowIterator {
    int n, dn, max;
    bool direction;

    RowIterator(const double& start, int max) 
    : n(std::round(start)), max(max), dn(0), direction(n < start) {
        if (n < 0) n = 0; else if (n > max) n = max;
    }

    RowIterator& operator++() {
        int ndn = direction ? 
            (dn > 0 ? -dn : (-dn + 1)) :
            (dn < 0 ? -dn : (-dn - 1));
        if (n + ndn < 0) dn++;
        else if (n + ndn > max) dn--;
        else dn = ndn;
        return *this;
    }  

    RowIterator operator++(int) { RowIterator i = *this; ++(*this); return i; }

    int operator*() const { return n + dn; }

    bool end() const { return n + dn < 0 || n + dn > max; }
};

void Legalizer::legalize(DEF& def, const double& width) {
    std::vector<DEF::Component *> cells;
    std::transform(
        def.design.components.begin(), def.design.components.end(), std::back_inserter(cells)
        , [](DEF::Component& c) { return &c; }
    );
    std::sort(
        cells.begin(), cells.end(), 
        [](DEF::Component* a, DEF::Component* b) { return a->x < b->x; }
    );

    std::vector<Row> rows;
    std::transform(
        def.design.rows.cbegin(), def.design.rows.cend(), std::back_inserter(rows)
        , [](const DEF::Row& r) { return Row{&r}; }
    );

    const double rowHeight = rows[1].row->y - rows[0].row->y;

    cellWidth = std::ceil(width / rows[0].row->stepX) * rows[0].row->stepX;
    
    for (const auto& cell : cells) {
        if (DEBUG) std::cout << "placing cell: " << cell->name << " (" << cell->x << ", " << cell->y << ")" << std::endl;
        double minCost = std::numeric_limits<double>::infinity();
        Row bestRow;
        std::size_t bestRowI;

        for (RowIterator ri{(cell->y - rows.front().row->y) / rowHeight, (int) rows.size() - 1}; !ri.end(); ++ri) {
            const auto& row = rows[*ri];
            if (DEBUG > 1) {
                std::cout << "  trying row " << *ri << ", row.y: " << row.row->y << ", clusters:";
                for (const auto& c : row.clusters) std::cout << " [" << c.x1 << ", " << c.x2 << "]";
                std::cout << std::endl;
            }

            if (cellWidth > row.width || (!row.clusters.empty() && (row.clusters.back().x2 - row.clusters.back().x1 + cellWidth > row.width))) {
                if (DEBUG > 2) std::cout << "    insufficient row width" << std::endl;
                continue;
            }

            auto newRow = Row{row};
            if (DEBUG > 2) std::cout << "    creating cluster: ";
            Cluster cluster{cell, newRow};
            if (DEBUG > 2) std::cout << "[" << cluster.x1 << ", " << cluster.x2 << "]" << std::endl;
            const auto estimateCost = getCost(*cell, cluster.x1, newRow.row->y);
            if (DEBUG > 2) std::cout << "    estimate cost: " << estimateCost << std::endl;
            // minCost <= estimateCost < infinity: minCost (previous row) is the best solution
            if (estimateCost > minCost) {
                if (DEBUG > 2) std::cout << "    minimum cost found: " << minCost << std::endl;
                break;
            }
            // estimateCost <= minCost && valid placement: this is the best solution
            else if (newRow.directlyPlace(std::move(cluster))) {
                minCost = estimateCost;
                bestRow = std::move(newRow);
                bestRowI = *ri;
                if (DEBUG > 2) std::cout << "    minimum cost found: " << minCost << std::endl;
                break;
            }

            // overlap, appending to last cluster
            const auto cost = newRow.validateLastCluster();
            if (DEBUG > 2) std::cout << "    cost: " << cost << std::endl;
            if (cost < minCost) {
                minCost = cost;
                bestRow = std::move(newRow);
                bestRowI = *ri;
            }
        }
        if (minCost == std::numeric_limits<double>::infinity()) {
            std::cerr << "no space to place cell: " << cell->name << " (" << cell->x << ", " << cell->y << "), exiting ..." << std::endl;
            exit(1);
        }
        rows[bestRowI] = std::move(bestRow);
    }

    for (auto& row : rows) {
        for (auto& cluster : row.clusters) {
            double x = cluster.x1;
            for (auto& cell : cluster.cells) {
                cell->x = x;
                cell->y = row.row->y;
                cell->orientation = row.row->orientation;
                x += cellWidth;
            }
        }
    }
}