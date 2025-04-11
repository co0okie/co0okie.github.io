#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
#include "DEF.h"
#include "Constant.h"

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
        
        DEF def = DEF::fromDefFile(argv[3]);

        const auto cellWidth = def.design.rows[0].stepX * width;
        
        def.legalize(cellWidth);

        def.toDefFile(argv[4]);

        def.toGnuPlotFile("output.gp", cellWidth);

        return 0;
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}