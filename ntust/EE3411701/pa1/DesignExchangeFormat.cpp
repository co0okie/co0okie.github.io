#include "DesignExchangeFormat.h"
#include <cctype>
#include <string>
#include <sstream>

DesignExchangeFormat::DesignExchangeFormat(const std::string& def) {
    parseDef(def);
}

void DesignExchangeFormat::parseDef(const std::string& def) {
    design.components.clear();
    design.specialnets.clear();
    
    char ch;
    size_t pos = -1;

    /**
     * eat: comsume optionally, return bool
     * parse: consume mandatorily, throw error if fail
     */

    auto nextChar = [&]() {
        ch = (++pos < def.length()) ? def[pos] : -1;
    };

    auto eatSpace = [&]() {
        while (ch == ' ' || ch == '\t' || ch == '\n' || ch == '\r') {
            nextChar();
        }
    };
    
    /** without eating spaces */
    auto eat = [&](const char& c) -> bool {
        if (ch == c) {
            nextChar();
            return true;
        }
        return false;
    };

    /** and eat spaces */
    auto eatChar = [&](const char& c) -> bool {
        bool res = eat(c);
        eatSpace();
        return res;
    };

    auto parseChar = [&](const char& c) {
        if (!eatChar(c)) throw std::runtime_error("expect '" + std::string(1, c) + "' at " + std::to_string(pos) +
            "-th char, but got '" + std::string(1, ch) + "'");
    };

    auto eatString = [&](const std::string& str) -> bool {
        size_t oldPos = pos;
        for (const char& c : str) {
            if (!eat(c)) {
                pos = oldPos - 1;
                nextChar();
                return false;
            }
        }
        eatSpace();
        return true;
    };

    auto parseString = [&](const std::string& str) {
        if (!eatString(str))
            throw std::runtime_error("expect " + str + " at " + std::to_string(pos) + "-th char");
    };

    // go to next word, e.g. "abc  123   def" -> "123   def"
    auto parseWord = [&]() -> std::string {
        size_t oldPos = pos;
        while (ch != ' ' && ch != '\t' && ch != '\n' && ch != '\r') nextChar();
        size_t newPos = pos;
        eatSpace();
        return def.substr(oldPos, newPos - oldPos);
    };

    auto parseInt = [&]() -> int {
        if (!std::isdigit(ch))
            throw std::runtime_error("expect digit at " + std::to_string(pos) +
                                     "-th char, but got '" + std::to_string(ch) + "'");
        size_t oldPos = pos;
        for (;;) {
            nextChar();
            if (!std::isdigit(ch)) break;
        }
        int value = std::stoi(def.substr(oldPos, pos - oldPos));
        eatSpace();
        return value;
    };

    auto parsePoint = [&]() -> Point {
        parseChar('(');
        Point p{ parseInt(), parseInt() };
        parseChar(')');
        return p;
    };

    auto parseTwoPoints = [&]() -> TwoPoints {
        TwoPoints p;
        Point p1 = parsePoint();
        p.x1 = p1.x; p.y1 = p1.y;
        parseChar('(');
        p.x2 = eatChar('*') ? p.x1 : parseInt();
        p.y2 = eatChar('*') ? p.y1 : parseInt();
        parseChar(')');
        return p;
    };

    auto parseDiearea = [&]() {
        Point p1 = parsePoint(), p2 = parsePoint();
        design.diearea = Diearea { p1.x, p1.y, p2.x, p2.y };
        eatChar(';');
    };

    auto parseComponent = [&]() {
        Component component;
        component.label = parseWord();
        parseWord();
        parseChar('+');
        parseString("PLACED");
        Point p = parsePoint();
        component.x = p.x; component.y = p.y;
        parseWord();
        eatChar(';');
        design.components.push_back(component);
    };

    auto parseComponents = [&]() {
        parseInt(); 
        eatChar(';');
        for (;;) {
            if (!eatChar('-')) break;
            parseComponent();
        }
        parseString("END"); 
        parseString("COMPONENTS");
    };

    auto parseSpecialnet = [&]() {
        Specialnet specialnet;
        specialnet.label = parseWord();
        parseChar('+');
        parseString("ROUTED");
        specialnet.layer = parseWord();
        specialnet.width = parseInt();
        TwoPoints p = parseTwoPoints();
        specialnet.x1 = p.x1; specialnet.y1 = p.y1;
        specialnet.x2 = p.x2; specialnet.y2 = p.y2;
        eatChar(';');
        design.specialnets.push_back(specialnet);
    };

    auto parseSpecialnets = [&]() {
        parseInt();
        eatChar(';');
        for (;;) {
            if (!eatChar('-')) break;
            parseSpecialnet();
        }
        parseString("END");
        parseString("SPECIALNETS");
    };
    
    nextChar();
    eatSpace();
    while (pos < def.length()) {
        if (eatString("DIEAREA")) {
            parseDiearea();
        } else if (eatString("COMPONENTS")) {
            parseComponents();
        } else if (eatString("SPECIALNETS")) {
            parseSpecialnets();
        } else {
            parseWord();
        }
    }
}


std::string escapeUnderscores(const std::string& input) {
    std::string result = input;
    std::size_t pos = 0;

    // Find each underscore and replace it with "\\\_"
    while ((pos = result.find('_', pos)) != std::string::npos) {
        result.replace(pos, 1, "\\\\\\_");
        pos += 4; // Move past the inserted backslashes
    }
    return result;
}

std::stringstream DesignExchangeFormat::toGnuPlot(const int& msbcsWidth, const int& msbcsHeight) const {
    std::stringstream gp;
    gp << "reset\n";
    gp << "set title \"result\"\n";
    gp << "set xlabel \"X\"\n";
    gp << "set ylabel \"Y\"\n";
    gp << "\n";

    int i = 1;
    for (const auto& component : design.components) {
        int x1 = component.x, y1 = component.y;
        int x2 = x1 + msbcsWidth, y2 = y1 + msbcsHeight;
        int xCenter = (x1 + x2) / 2, yCenter = (y1 + y2) / 2;
        gp << "set object " << i++ << " rect from " << x1 << "," << y1 << " to " << x2 << "," << y2 << " lw 1 fs solid fc rgb \"#ff66ff\"\n";
        gp << "set label \"" << escapeUnderscores(component.label) << "\" at " << xCenter << "," << yCenter << " center\n";
    }
    gp << "\n";

    for (const auto& specialnet : design.specialnets) {
        bool vertical = specialnet.x1 == specialnet.x2;
        int x1 = specialnet.x1, y1 = specialnet.y1, x2 = specialnet.x2, y2 = specialnet.y2;
        if (vertical) {
            x1 -= specialnet.width / 2;
            x2 += specialnet.width / 2;
        } else {
            y1 -= specialnet.width / 2;
            y2 += specialnet.width / 2;
        }
        int xCenter = (x1 + x2) / 2, yCenter = (y1 + y2) / 2;
        gp << "set object " << i++ << " rect from " << x1 << "," << y1 << " to " << x2 << "," << y2 << " lw 1 fs solid fc rgb ";
        if (specialnet.layer == "ME3") gp << "\"#9966ff\"\n";
        else if (specialnet.layer == "ME4") gp << "\"#66b3ff\"\n";
        else gp << "\"#66ffff\"\n";

        gp << "set label \"" << escapeUnderscores(specialnet.label) << "\" at " << xCenter << "," << yCenter << " center";
        if (vertical) gp << " rotate by 270";
        gp << "\n";
    }
    gp << "\n";

    // gp << "set xtics 1000\n";
    // gp << "set ytics 1000\n";
    const auto& d = design.diearea;
    gp << "plot [" << d.x1 << ":" << d.x2 << "][" << d.y1 << ":" << d.y2 << "]0\n";
    gp << "set terminal png size " << (d.x2 - d.x1) / 32 << "," << (d.y2 - d.y1) / 32 << "\n";
    gp << "set output \"output.png\"\n";
    gp << "replot\n";

    return gp;
}
