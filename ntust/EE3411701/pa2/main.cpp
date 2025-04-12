#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
#include "DEF.h"
#include <chrono>
// #include <random>

int main(int argc, char* argv[]) {
    if (argc != 5) {
        std::cerr << "Usage: " << argv[0] << " [cell width (in terms of sites)] [alpha] [input file name] [output file name]" << std::endl;
        return 1;
    }

    try {
        double width;
        {
            std::istringstream ss(argv[1]);
            if (!(ss >> width))
                throw std::runtime_error("Invalid cell width: " + std::string(argv[1]));
        }
        double alpha;
        {
            std::istringstream ss(argv[2]);
            if (!(ss >> alpha))
                throw std::runtime_error("Invalid alpha: " + std::string(argv[2]));
        }
        
        using std::chrono::high_resolution_clock;
        using std::chrono::duration;
        auto t = high_resolution_clock::now();
        DEF def = DEF::fromDefFile(argv[3]);
        std::cout << "parsing def file takes " << duration<double, std::milli>{high_resolution_clock::now() - t}.count() << " ms" << std::endl;

        const auto cellWidth = def.design.rows[0].stepX * width;
        
        DEF legalizedDef{def};

        t = high_resolution_clock::now();
        legalizedDef.legalize(cellWidth);
        std::cout << "legalizing takes " << duration<double, std::milli>{high_resolution_clock::now() - t}.count() << " ms" << std::endl;
        
        double avgCost = 0, maxCost = 0;
        for (size_t i = 0; i < def.design.components.size(); ++i) {
            const auto& a = legalizedDef.design.components[i], b = def.design.components[i];
            double cost = std::abs(a.x - b.x) + std::abs(a.y - b.y);
            if (cost > maxCost) maxCost = cost;
            avgCost += cost;
        }
        avgCost /= def.design.components.size();
        std::cout << "  Avg. cell displacement = " << avgCost << std::endl;
        std::cout << "  Max. cell displacement = " << maxCost << std::endl;
        std::cout << "  Avg. cell displacement + α ⋅ Max. cell displacement = " << avgCost + alpha * maxCost << std::endl;
        
        t = high_resolution_clock::now();
        legalizedDef.toDefFile(argv[4]);
        std::cout << "writing def file takes " << duration<double, std::milli>{high_resolution_clock::now() - t}.count() << " ms" << std::endl;
        
        // t = high_resolution_clock::now();
        // legalizedDef.toGnuPlotFile("output.gp", cellWidth);
        // std::cout << "writing gnuplot file takes " << duration<double, std::milli>{high_resolution_clock::now() - t}.count() << " ms" << std::endl;

    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }

    { // generating super3.def
        // DEF def;
        // def.design.diearea = {0, 0, 1500 * 300, 1250 * 240};
        // def.design.rows.reserve(240);
        // for (size_t i = 0; i < def.design.rows.capacity(); ++i) {
        //     def.design.rows.push_back(DEF::Row{
        //         "row_" + std::to_string(i), "core",
        //         0, 1250 * (double) i, i % 2 ? Orientation::FS : Orientation::N,
        //         1500, 1, 300, 0
        //     });
        // }
    
        // std::mt19937_64 rng;
        // uint64_t timeSeed = std::chrono::high_resolution_clock::now().time_since_epoch().count();
        // std::seed_seq ss{uint32_t(timeSeed & 0xffffffff), uint32_t(timeSeed>>32)};
        // rng.seed(ss);
        // std::uniform_real_distribution<double> unif(-0.01, 1.01);
        // def.design.components.reserve(41932 * 2);
        // for (size_t i = 0; i < def.design.components.capacity(); ++i) {
        //     def.design.components.push_back(DEF::Component{
        //         std::to_string(i), "kanye",
        //         unif(rng) * def.design.diearea.x2, unif(rng) * def.design.diearea.y2,
        //         Orientation::N
        //     });
        // }
        // def.toDefFile("super3.def");
    }

    return 0;
}