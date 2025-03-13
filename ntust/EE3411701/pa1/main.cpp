#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
#include "DesignExchangeFormat.h"

int stoi(const std::string& s) {
    try {
        return std::stoi(s);
    } catch (const std::invalid_argument&) {
        std::cerr << "MSBCS_width and MSBCS_height must be number" << std::endl;
        exit(1);
    } catch (const std::out_of_range&) {
        std::cerr << "MSBCS_width or MSBCS_height is out of range" << std::endl;
        exit(1);
    }
}

int main(int argc, char* argv[]) {
    if (argc != 5) {
        std::cerr << "Usage: ./genPlot MSBCS_width MSBCS_height input.def output.gp" << std::endl;
        return 1;
    }

    const int msbcsWidth = stoi(argv[1]);
    const int msbcsHeight = stoi(argv[2]);
    std::ifstream inputFile{argv[3]};
    std::ofstream outputFile{argv[4]};

    std::stringstream input;
    input << inputFile.rdbuf();
    inputFile.close();

    outputFile << DesignExchangeFormat{input.str()}.toGnuPlot(msbcsWidth, msbcsHeight).rdbuf();
    outputFile.close();

    return 0;
}