1. 學號：B11107051
2. 姓名：李品翰
3. 使用之程式語言：C++
4. 使用之編譯平台：g++ (Debian 12.2.0-14) 12.2.0
5. 檔案壓縮方式: tar zcvf b11107051-p1.tgz b11107051-p1
6. 各檔案說明：
    b11107051-p1/main.cpp                 : 主程式source code
    b11107051-p1/DesignExchangeFormat.h   : 解析、儲存、轉換 .def 格式字串
    b11107051-p1/DesignExchangeFormat.cpp : DesignExchangeFormat.h 的實作
    b11107051-p1/Makefile                 : Makefile
    b11107051-p1/README.txt               : 本檔案
7. 編譯方式說明：            
    在 b11107051-p1/ 這個資料夾下指令 : make
    即可在 b11107051-p1 產生 genPlot 的執行檔
8. 執行、使用方式說明：
    compile 完成後，在 b11107051-p1/ 目錄下會產生一個 genPlot 的執行檔
    執行檔的命令格式為 :
    ./genPlot MSBCS_width MSBCS_height /path/to/input/file.def /path/to/output/file.gp

    ex: ./genPlot 7100 6600 input.gp output.gp