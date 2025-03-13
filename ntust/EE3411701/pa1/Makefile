CC = g++
# use wildcard to expand all cpp in makefile, not in shell, e.g. 1.cpp 2.cpp 3.cpp
SOURCES = $(wildcard *.cpp)
# replace all .cpp to .o, e.g. 1.o 2.o 3.o
OBJECTS = $(SOURCES:.cpp=.o)
EXECUTABLE = genPlot
OUTPUT_GP = output.gp
INPUT_DEF = CS12x12.def
GNUPLOT = gnuplot

all: $(EXECUTABLE)

png: $(OUTPUT_GP)
	$(GNUPLOT) $(OUTPUT_GP)

$(OUTPUT_GP): $(EXECUTABLE)
	./$(EXECUTABLE) 7100 6600 $(INPUT_DEF) $(OUTPUT_GP)

$(EXECUTABLE): $(OBJECTS)
	$(CC) $(OBJECTS) -o $(EXECUTABLE)

%.o: %.cpp
	$(CC) -std=c++11 -O3 -c $< -o $@

clean:
	rm -rf $(OBJECTS) $(EXECUTABLE)

clean-plot:
	rm -rf $(OBJECTS) $(EXECUTABLE) output.gp output.png
