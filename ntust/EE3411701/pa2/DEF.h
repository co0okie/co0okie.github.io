#ifndef DESIGN_EXCHANGE_FORMAT_H
#define DESIGN_EXCHANGE_FORMAT_H

#include <string>
#include <vector>
#include <stdexcept>

enum class Orientation { N, S, W, E, FN, FS, FW, FE };

class DEF {
public:
    typedef std::string Version;
    typedef std::string DividerChar;
    typedef std::string BusBitChars;
    typedef unsigned int Units;

    struct Point {
        double x, y;
    };

    struct TwoPoints {
        double x1, y1, x2, y2;
    };

    struct Diearea {
        double x1, y1, x2, y2;
    };

    struct Specialnet {
        std::string label, layer;
        double width, x1, y1, x2, y2;
    };

    struct Component {
        std::string name, modelName;
        double x, y;
        Orientation orientation;
    };

    struct Row {
        std::string name;
        std::string siteName;
        double x, y;
        Orientation orientation;
        size_t countX, countY;
        double stepX, stepY;
    };

    struct Design {
        std::string name;
        Units units;
        Diearea diearea;
        std::vector<Component> components;
        std::vector<Specialnet> specialnets;
        std::vector<Row> rows;
    };

    Version version;
    DividerChar dividerChar;
    BusBitChars busBitChars;
    Design design;

    DEF() = default;

    DEF(const std::string& defString);
    
    std::stringstream toGnuPlotString(const double& msbcsWidth, const double& msbcsHeight = 0) const;

    void toGnuPlotFile(const std::string& filename, const double& msbcsWidth, const double& msbcsHeight = 0) const;

    void toDefFile(const std::string& filename) const;

    static DEF fromDefFile(const std::string& filename);

    void legalize(const double& cellWidth) { Legalizer::legalize(*this, cellWidth); }

private:
    template <class T> T toGnuPlot(T&& stream, const double& msbcsWidth, const double& msbcsHeight = 0) const;
};

#endif