#ifndef DESIGN_EXCHANGE_FORMAT_H
#define DESIGN_EXCHANGE_FORMAT_H

#include <string>
#include <vector>
#include <stdexcept>

class DesignExchangeFormat {
public:
    struct Point {
        int x, y;
    };

    struct TwoPoints {
        int x1, y1, x2, y2;
    };

    struct Diearea {
        int x1, y1, x2, y2;
    };

    struct Specialnet {
        std::string label, layer;
        int width, x1, y1, x2, y2;
    };

    struct Component {
        std::string label;
        int x, y;
    };

    struct Design {
        Diearea diearea;
        std::vector<Component> components;
        std::vector<Specialnet> specialnets;
    };

    Design design;

    DesignExchangeFormat(const std::string& def);

    std::stringstream toGnuPlot(const int& msbcsWidth, const int& msbcsHeight) const;
    // Design parse();
    // static Design parse(const std::string& s);

private:
    // const std::string str;
    // size_t pos;
    // char ch;

    void parseDef(const std::string& def);

    // Diearea parseDiearea();
    // std::vector<Component> parseComponents();
    // Component parseComponent();
    // std::vector<Specialnet> parseSpecialnets();
    // Specialnet parseSpecialnet();
    // Point parsePoint();
    // TwoPoints parseTwoPoints();
    // int parseInt();
    // void nextChar();
    // bool eat(const char& c);
    // std::string parseWord();
    // std::string parseWord(const std::string& word);
    // bool eatWord(const std::string& word);
    // void eatSpace();
};

#endif
