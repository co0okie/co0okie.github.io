#ifndef LEGALIZER_H
#define LEGALIZER_H

#include "DEF.h"

class Legalizer {
public:
    static void legalize(DEF& def, const double& cellWidth);
};

#endif