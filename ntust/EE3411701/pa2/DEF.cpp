// https://coriolis.lip6.fr/doc/lefdef/lefdefref/DEFSyntax.html

#include "DEF.h"
#include <cctype>
#include <string>
#include <sstream>
#include <algorithm>
#include <fstream>
#include <iostream>

#define DEBUG 0

class DEFParser {
public:
    DEF def;
    
    DEFParser(const std::string& str) : str(str), pos(-1) {
        nextChar();
        eatSpace();
        def = parseDef();
    }

private:
    std::string str;
    size_t pos;
    char ch;

    void nextChar() {
        pos++;
        ch = (pos < str.length()) ? str[pos] : -1;
    }

    /**
     * eat: comsume optionally, return bool
     * parse: consume mandatorily, throw error if fail
     */

    void eatSpace() {
        while (ch == ' ' || ch == '\t' || ch == '\n' || ch == '\r') {
            nextChar();
        }
    }

    /** without eating spaces */
    bool eat(const char& c) {
        if (ch == c) {
            nextChar();
            return true;
        }
        return false;
    }

    /** and eat spaces */
    bool eatChar(const char& c) {
        bool res = eat(c);
        eatSpace();
        return res;
    }

    void parseChar(const char& c) {
        if (!eatChar(c)) throw std::runtime_error(
            "expect '" + std::string(1, c) + "' at " + std::to_string(pos) +
            "-th char, but got '" + std::string(1, ch) + "'"
        );
    }

    bool eatString(const std::string& str) {
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
    }

    void parseString(const std::string& str) {
        if (!eatString(str))
            throw std::runtime_error("expect " + str + " at " + std::to_string(pos) + "-th char");
        if (DEBUG > 5) std::cout << "parseString: " << str << std::endl;
    }

    std::string parseQuotedString() {
        parseChar('"');
        std::string s;
        for (;;) {
            if (eat('\\')) {
                if (eat('\\')) s += '\\';
                else if (eat('"')) s += '"';
                else if (eat('n')) s += '\n';
                else if (eat('t')) s += '\t';
            }
            else if (eat('"')) break;
            else if (ch == -1) throw std::runtime_error("expect \", but got EOF");
            else {
                s += ch;
                nextChar();
            }
        }

        eatSpace();
        return s;
    }

    // go to next word, e.g. "abc  123   def" -> "123   def"
    std::string parseWord() {
        size_t oldPos = pos;
        while (ch != ' ' && ch != '\t' && ch != '\n' && ch != '\r' && ch != -1) nextChar();
        size_t newPos = pos;
        eatSpace();
        const auto s = str.substr(oldPos, newPos - oldPos);
        if (DEBUG > 4) std::cout << "parseWord: " << s << std::endl;
        return s;
    }

    int parseInt() {
        if (!std::isdigit(ch))
            throw std::runtime_error("expect digit at " + std::to_string(pos) +
                                     "-th char, but got '" + std::to_string(ch) + "'");
        size_t oldPos = pos;
        for (;;) {
            nextChar();
            if (!std::isdigit(ch)) break;
        }
        int value = std::stoi(str.substr(oldPos, pos - oldPos));
        eatSpace();
        return value;
    }

    double parseDouble() {
        std::string s = parseWord();
        try {
            return std::stod(s);
        } catch (const std::exception&) {
            throw std::runtime_error(
                "expect double at " + std::to_string(pos) +
                "-th char, but got '" + s + "'"
            );
        }
    }

    Orientation parseOrientation() {
        std::string s = parseWord();
        if (s == "N") return Orientation::N;
        else if (s == "S") return Orientation::S;
        else if (s == "W") return Orientation::W;
        else if (s == "E") return Orientation::E;
        else if (s == "FN") return Orientation::FN;
        else if (s == "FS") return Orientation::FS;
        else if (s == "FW") return Orientation::FW;
        else if (s == "FE") return Orientation::FE;
        else throw std::runtime_error("unknow orientation '" + s + "' at " + std::to_string(pos) + "-th char");
    }

    DEF::Point parsePoint() {
        parseChar('(');
        DEF::Point p{ parseDouble(), parseDouble() };
        parseChar(')');
        return p;
    }

    DEF::TwoPoints parseTwoPoints() {
        DEF::TwoPoints p;
        DEF::Point p1 = parsePoint();
        p.x1 = p1.x; p.y1 = p1.y;
        parseChar('(');
        p.x2 = eatChar('*') ? p.x1 : parseDouble();
        p.y2 = eatChar('*') ? p.y1 : parseDouble();
        parseChar(')');
        return p;
    }

    DEF::Version parseVersion() {
        const auto&& version = parseWord();
        eatChar(';');
        return version;
    }

    DEF::DividerChar parseDividerChar() {
        const auto&& s = parseQuotedString();
        eatChar(';');
        return s;
    }

    DEF::BusBitChars parseBusBitChars() {
        const auto&& s = parseQuotedString();
        eatChar(';');
        return s;
    }

    DEF::Units parseUnits() {
        parseString("DISTANCE"); parseString("MICRONS");
        const auto&& units = parseInt();
        eatChar(';');
        return units;
    }

    DEF::Component parseComponent() {
        DEF::Component component;
        component.name = parseWord();
        component.modelName = parseWord();
        parseChar('+');
        parseString("PLACED");
        DEF::Point p = parsePoint();
        component.x = p.x; component.y = p.y;
        component.orientation = parseOrientation();
        eatChar(';');
        return component;
    }

    DEF::Specialnet parseSpecialnet() {
        DEF::Specialnet specialnet;
        specialnet.label = parseWord();
        parseChar('+');
        parseString("ROUTED");
        specialnet.layer = parseWord();
        specialnet.width = parseDouble();
        DEF::TwoPoints p = parseTwoPoints();
        specialnet.x1 = p.x1; specialnet.y1 = p.y1;
        specialnet.x2 = p.x2; specialnet.y2 = p.y2;
        eatChar(';');
        return specialnet;
    }

    DEF::Diearea parseDiearea() {
        DEF::Point p1 = parsePoint(), p2 = parsePoint();
        eatChar(';');
        if (DEBUG > 1) std::cout << "parseDiearea: (" << p1.x << ", " << p1.y << ") (" << p2.x << ", " << p2.y << ")" << std::endl;
        return { p1.x, p1.y, p2.x, p2.y };
    }

    DEF::Row parseRow() {
        DEF::Row row;
        row.name = parseWord();
        row.siteName = parseWord();
        row.x = parseDouble();
        row.y = parseDouble();
        row.orientation = parseOrientation();
        parseString("DO");
        row.countX = parseInt();
        parseString("BY");
        row.countY = parseInt();
        parseString("STEP");
        row.stepX = parseDouble();
        row.stepY = parseDouble();
        eatChar(';');
        if (DEBUG > 1) std::cout << "parseRow: " << row.name << " (" << row.x << ", " << row.y << ")" << std::endl;
        return row;
    }

    std::vector<DEF::Component> parseComponents() {
        std::vector<DEF::Component> components;
        components.reserve((size_t)parseInt());
        eatChar(';');
        while (eatChar('-')) {
            components.push_back(parseComponent());
        }
        parseString("END COMPONENTS");
        if (DEBUG > 1) std::cout << "parseComponents: " << components.size() << std::endl;
        return components;
    }

    std::vector<DEF::Specialnet> parseSpecialnets() {
        std::vector<DEF::Specialnet> specialnets;
        specialnets.reserve((size_t)parseInt());
        eatChar(';');
        while (eatChar('-')) {
            specialnets.push_back(parseSpecialnet());
        }
        parseString("END SPECIALNETS");
        if (DEBUG > 1) std::cout << "parseSpecialnets: " << specialnets.size() << std::endl;
        return specialnets;
    }

    DEF::Design parseDesign() {
        DEF::Design design;
        design.name = parseWord();
        eatChar(';');
        for (;;) {
            if (eatString("UNITS")) {
                design.units = parseUnits();
            } else if (eatString("DIEAREA")) {
                design.diearea = parseDiearea();
            } else if (eatString("ROW")) {
                design.rows.push_back(parseRow());
            } else if (eatString("COMPONENTS")) {
                design.components = parseComponents();
            } else if (eatString("SPECIALNETS")) {
                design.specialnets = parseSpecialnets();
            } else if (eatString("END DESIGN")) {
                break;
            } else if (ch == -1) {
                throw std::runtime_error("expect 'END DESIGN', but got EOF");
            } else {
                std::cerr << "unexpected: " << parseWord() << std::endl;
                // parseWord();
            }
        }
        if (DEBUG) std::cout << "parseDesign: " << design.name << std::endl;
        return design;
    }

    DEF parseDef() {
        DEF def;
        while (pos < str.length()) {
            if (eatString("VERSION")) {
                def.version = parseVersion();
            } else if (eatString("DIVIDERCHAR")) {
                def.dividerChar = parseDividerChar();
            } else if (eatString("BUSBITCHARS")) {
                def.busBitChars = parseBusBitChars();
            } else if (eatString("DESIGN")) {
                def.design = parseDesign();
            } else {
                std::cerr << "unexpected: " << parseWord() << std::endl;
                // parseWord();
            }
        }
        if (DEBUG) std::cout << "parseDef" << std::endl;
        return def;
    }
};

DEF::DEF(const std::string& str) {
    *this = DEFParser{str}.def;
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

template <class T> T DEF::toGnuPlot(T&& stream, const double& msbcsWidth, const double& msbcsHeight) const {
    const auto rowHeight = design.rows.size() > 1 ? 
        (design.rows[1].y - design.rows[0].y) : 0;

    const auto componentHeight = msbcsHeight == 0 ? rowHeight : msbcsHeight;

    const auto componentsMinMaxXPair = std::minmax_element(
        design.components.begin(), 
        design.components.end(), 
        [](const Component& a, const Component& b) { return a.x < b.x; }
    );
    const auto componentsMinMaxYPair = std::minmax_element(
        design.components.begin(), 
        design.components.end(), 
        [](const Component& a, const Component& b) { return a.y < b.y; }
    );
    const auto x1 = std::min(design.diearea.x1, componentsMinMaxXPair.first->x), 
               x2 = std::max(design.diearea.x2, componentsMinMaxXPair.second->x + msbcsWidth);
    const auto y1 = std::min(design.diearea.y1, componentsMinMaxYPair.first->y), 
               y2 = std::max(design.diearea.y2, componentsMinMaxYPair.second->y + rowHeight);
    
    const double padding = 100; // px
    const double image2PlotRatio = 12;

    stream << "reset\n";
    stream << "set title \"result\"\n";
    stream << "set xlabel \"X\"\n";
    stream << "set ylabel \"Y\"\n";
    stream << "set xtics 1000\n";
    stream << "set ytics 1000\n";
    stream << "set xrange [" << x1 - padding * image2PlotRatio << ":" << x2 + padding * image2PlotRatio << "]\n";
    stream << "set yrange [" << y1 - padding * image2PlotRatio << ":" << y2 + padding * image2PlotRatio << "]\n";
    stream << "set terminal png size " 
           << (x2 - x1) / image2PlotRatio + 144 + padding << "," 
           << (y2 - y1) / image2PlotRatio + 106 + padding << "\n";
    stream << "set output \"output.png\"\n";
    stream << "\n";

    size_t i = 1;

    for (const auto& row : design.rows) {
        double x1 = row.x, y1 = row.y;
        double x2 = x1 + row.countX * row.stepX;
        double y2 = y1 + row.countY * (row.stepY == 0 ? rowHeight : row.stepY);
        stream << "set object " << i++ << " rect from " 
           << x1 << "," << y1 << " to " << x2 << "," << y2 
           << " lw 2 fs empty\n";
    }
    stream << "\n";

    stream << "set style rect fs solid fc rgb \"#ff66ff\"\n";
    for (const auto& component : design.components) {
        double x1 = component.x, y1 = component.y;
        double x2 = x1 + msbcsWidth, y2 = y1 + componentHeight;
        double xCenter = (x1 + x2) / 2, yCenter = (y1 + y2) / 2;
        stream << "set object " << i++ << " rect from " 
           << x1 << "," << y1 << " to " << x2 << "," << y2 << "\n";
        stream << "set label \"" << escapeUnderscores(component.name) 
           << "\" at " << xCenter << "," << yCenter << " center\n";
    }
    stream << "\n";

    for (const auto& specialnet : design.specialnets) {
        bool vertical = specialnet.x1 == specialnet.x2;
        double x1 = specialnet.x1, y1 = specialnet.y1, x2 = specialnet.x2, y2 = specialnet.y2;
        if (vertical) {
            x1 -= specialnet.width / 2;
            x2 += specialnet.width / 2;
        } else {
            y1 -= specialnet.width / 2;
            y2 += specialnet.width / 2;
        }
        double xCenter = (x1 + x2) / 2, yCenter = (y1 + y2) / 2;
        stream << "set object " << i++ << " rect from " 
           << x1 << "," << y1 << " to " << x2 << "," << y2 
           << " fs solid fc rgb ";
        if (specialnet.layer == "ME3") stream << "\"#9966ff\"";
        else if (specialnet.layer == "ME4") stream << "\"#66b3ff\"";
        else stream << "\"#66ffff\"";
        stream << " noborder\n";

        stream << "set label \"" << escapeUnderscores(specialnet.label) << "\" at " << xCenter << "," << yCenter << " center";
        if (vertical) stream << " rotate by 270";
        stream << "\n";
    }
    stream << "\n";
    
    stream << "plot NaN notitle\n";
    stream << "replot\n";

    if (DEBUG) std::cout << "toGnuPlot" << std::endl;
    return std::move(stream);
}

std::stringstream DEF::toGnuPlotString(const double& msbcsWidth, const double& msbcsHeight) const {
    return toGnuPlot(std::stringstream{}, msbcsWidth, msbcsHeight);
}

void DEF::toGnuPlotFile(const std::string& filename, const double& msbcsWidth, const double& msbcsHeight) const {
    toGnuPlot(std::ofstream{filename}, msbcsWidth, msbcsHeight).close();
    if (DEBUG) std::cout << "toGnuPlotFile: " << filename << std::endl;
}

std::string orientation2String(const Orientation& orientation) {
    switch (orientation) {
        case Orientation::N: return "N";
        case Orientation::S: return "S";
        case Orientation::W: return "W";
        case Orientation::E: return "E";
        case Orientation::FN: return "FN";
        case Orientation::FS: return "FS";
        case Orientation::FW: return "FW";
        case Orientation::FE: return "FE";
        default: throw std::runtime_error("unknown orientation");
    }
}

void DEF::toDefFile(const std::string& filename) const {
    std::ofstream def{filename};

    def << "VERSION " << version << " ;\n";
    def << "DIVIDERCHAR \"" << dividerChar << "\" ;\n";
    def << "BUSBITCHARS \"" << busBitChars << "\" ;\n";

    def << "DESIGN " << design.name << " ;\n";
    def << "UNITS DISTANCE MICRONS " << design.units << " ;\n";
    def << std::endl;
    def << "DIEAREA ( " << design.diearea.x1 << " " << design.diearea.y1 << " ) ( " 
        << design.diearea.x2 << " " << design.diearea.y2 << " ) ;\n";
    def << std::endl;

    for (const auto& row : design.rows) {
        def << "ROW " << row.name << " " << row.siteName << " " 
            << row.x << " " << row.y << " " << orientation2String(row.orientation) 
            << " DO " << row.countX << " BY " << row.countY 
            << " STEP " << row.stepX << " " << row.stepY << " ;\n";
    }
    def << std::endl;

    if (design.components.size()) {
        def << "COMPONENTS " << design.components.size() << " ;\n";
        for (const auto& component : design.components) {
            def << "- " << component.name << " " << component.modelName 
                << " + PLACED ( " << component.x << " " << component.y << " ) " 
                << orientation2String(component.orientation) << " ;\n";
        }
        def << "END COMPONENTS\n" << std::endl;
    }

    if (design.specialnets.size()) {
        // I will complete this in the future
    }

    def << "END DESIGN\n";

    if (DEBUG) std::cout << "toDef: " << filename << std::endl;
}

DEF DEF::fromDefFile(const std::string& filename) {
    std::ifstream def{filename};
    std::stringstream ss;
    ss << def.rdbuf();
    def.close();
    return DEF{ss.str()};
}

void DEF::legalize(const double& cellWidth) { Legalizer::legalize(*this, cellWidth); }
