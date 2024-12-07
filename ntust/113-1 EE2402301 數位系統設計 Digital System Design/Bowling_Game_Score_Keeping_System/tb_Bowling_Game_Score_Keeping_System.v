module tb_Bowling_Game_Score_Keeping_System();
    wire [0:7] seven_segment_hundreds, seven_segment_tens, seven_segment_units;
    wire Done; // game finish
    reg [3:0] N; // number of pins knocked down
    reg UPD; // update, posedge trigger
    reg clock, reset;
    
    Bowling_Game_Score_Keeping_System M1(
        {seven_segment_hundreds, seven_segment_tens, seven_segment_units}, 
        Done, N, UPD, clock, reset
    );
    
    initial begin
        clock = 0;
        forever #1 clock = ~clock;
    end
    
    initial fork
        reset = 1; UPD = 0; #10 reset = 0;
        
        // 1st frame
        #10  N =  4;  #11 UPD = 1; #13  UPD = 0; // score: 0 + 4          =   4
        #30  N =  5;  #31 UPD = 1; #33  UPD = 0; // score: 4 + 5          =   9
        
        // 2nd frame
        #50  N =  7;  #51 UPD = 1; #53  UPD = 0; // score: 9 + 7          =  16
        #70  N =  3;  #71 UPD = 1; #73  UPD = 0; // score: 16 + 3         =  19
        
        // 3rd frame
        #90  N =  2;  #91 UPD = 1; #93  UPD = 0; // score: 19 + 2 + 2     =  23
        #110 N =  6; #111 UPD = 1; #113 UPD = 0; // score: 23 + 6         =  29
        
        // 4th frame
        #130 N = 10; #131 UPD = 1; #133 UPD = 0; // score: 29 + 10        =  39
        
        // 5th frame
        #150 N = 10; #151 UPD = 1; #153 UPD = 0; // score: 39 + 10 + 10   =  59
        
        // 6th frame
        #170 N =  1; #171 UPD = 1; #173 UPD = 0; // score: 59 + 1 + 1 + 1 =  62
        #190 N =  9; #191 UPD = 1; #193 UPD = 0; // score: 62 + 9 + 9     =  80
        
        // 7th frame
        #210 N = 10; #211 UPD = 1; #213 UPD = 0; // score: 80 + 10 + 10   = 100
        
        // 8th frame
        #230 N =  3; #231 UPD = 1; #233 UPD = 0; // score: 100 + 3 + 3    = 106
        #250 N =  1; #251 UPD = 1; #253 UPD = 0; // score: 106 + 1 + 1    = 108
        
        // 9th frame
        #270 N =  3; #271 UPD = 1; #273 UPD = 0; // score: 108 + 3        = 111
        #290 N =  3; #291 UPD = 1; #293 UPD = 0; // score: 111 + 3        = 114
        
        // 10th frame
        #310 N =  9; #311 UPD = 1; #313 UPD = 0; // score: 114 + 9        = 123
        #330 N =  1; #331 UPD = 1; #333 UPD = 0; // score: 123 + 1        = 124
        
        // extra throw
        #350 N = 10; #351 UPD = 1; #353 UPD = 0; // score: 124 + 10       = 134
        
        
        // perfect game
        #390 reset = 1; #400 reset = 0;
        #400 N = 10;
        #401 UPD = 1; #403 UPD = 0; // 1st frame
        #421 UPD = 1; #423 UPD = 0; // 2nd frame
        #441 UPD = 1; #443 UPD = 0; // 3rd frame
        #461 UPD = 1; #463 UPD = 0; // 4th frame
        #481 UPD = 1; #483 UPD = 0; // 5th frame
        #501 UPD = 1; #503 UPD = 0; // 6th frame
        #521 UPD = 1; #523 UPD = 0; // 7th frame
        #541 UPD = 1; #543 UPD = 0; // 8th frame
        #561 UPD = 1; #563 UPD = 0; // 9th frame
        #581 UPD = 1; #583 UPD = 0; // 10th frame
        #601 UPD = 1; #603 UPD = 0; // extra 1
        #621 UPD = 1; #623 UPD = 0; // extra 2
        
        #700 $finish;
    join
endmodule