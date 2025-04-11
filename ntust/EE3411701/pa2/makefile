CC = g++
# use wildcard to expand all cpp in makefile, not in shell, e.g. 1.cpp 2.cpp 3.cpp
SOURCES = $(wildcard *.cpp)
# replace all .cpp to .o, e.g. 1.o 2.o 3.o
OBJECTS = $(SOURCES:.cpp=.o)
EXECUTABLE = legalizer
OUTPUT_GP = output.gp
OUTPUT_PNG = output.png
OUTPUT_DEF = output.def
# INPUT_DEF = case4.def
INPUT_DEF = super2.def
GNUPLOT = gnuplot

$(EXECUTABLE): $(OBJECTS)
	$(CC) $(OBJECTS) -o $(EXECUTABLE)

all: $(EXECUTABLE)

png: $(OUTPUT_PNG)

$(OUTPUT_PNG): $(OUTPUT_GP)
	$(GNUPLOT) $(OUTPUT_GP)

$(OUTPUT_GP) $(OUTPUT_DEF) run: $(EXECUTABLE) makefile
	./$(EXECUTABLE) 3 0.5 $(INPUT_DEF) $(OUTPUT_DEF)

%.o: %.cpp
	$(CC) -std=c++11 -O3 -g -c $< -o $@

clean:
	rm -rf $(OBJECTS) $(EXECUTABLE) output.gp output.png output.def