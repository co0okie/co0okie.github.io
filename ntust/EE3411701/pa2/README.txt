1. 學號：B11107051
2. 姓名：李品翰
3. 使用之程式語言：C++
4. 使用之編譯平台：g++ (Debian 12.2.0-14) 12.2.0
5. 檔案壓縮方式: tar zcvf b11107051-p2.tgz b11107051-p2
6. 各檔案說明：
    b11107051-p2/main.cpp      : 主程式source code
    b11107051-p2/DEF.h         : 解析、儲存、轉換 .def 檔案
    b11107051-p2/DEF.cpp       : DEF.h 的實作
    b11107051-p2/Legalizer.h   : 將 DEF 裡的 component 擺放到合法的位置
    b11107051-p2/Legalizer.cpp : Legalizer.h 的實作
    b11107051-p2/makefile      : 使用 `make` 編譯
    b11107051-p2/readme.txt    : 本檔案
7. 編譯方式說明：            
    在 b11107051-p2/ 這個資料夾下指令 : make
    即可在 b11107051-p2 產生 legalizer 的執行檔
8. 執行、使用方式說明：
    compile 完成後，在 b11107051-p2/ 目錄下會產生一個 legalizer 的執行檔
    執行檔的命令格式為 :
    ./legalizer [cell width (in terms of sites)] [alpha] [input file name] [output file name]

    ex: ./legalizer 5 0.5 super2.def super2.legalize.gp