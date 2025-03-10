module Bowling_Game_Score_Keeping_System(
    output [0:23] seven_segments, // 8 bits * 3 digits
    output Done,                  // game finish
    input [3:0] N,                // number of pins knocked down
    input UPD,                    // update
    input clock, reset
);
    wire [8:0] score; // 9 bits, 0 ~ 511
    wire [3:0] hundreds, tens, units;
    
    Controller           M1(Done, FT, AD, NF, UPD, APD, LF, clock, reset);
    APD_Logic            M2(APD, N, FT, clock);
    Score_Register       M3(score, N, AD, clock, reset);
    Frame_Counter        M4(LF, NF, clock, reset);
    Binary_to_BCD        M5(hundreds, tens, units, score);
    BCD_to_Seven_Segment M6(seven_segments[0:7], hundreds);
    BCD_to_Seven_Segment M7(seven_segments[8:15], tens);
    BCD_to_Seven_Segment M8(seven_segments[16:23], units);
endmodule

module Controller(
    output reg
        Done,
        FT,    // first throw
        AD,    // add score
        NF,    // new frame
    input
        UPD,   // update
        APD,   // all pins down
        LF,    // last frame
        clock, // negedge
        reset  // posedge, poslevel
);
    reg [1:0] bonus_count [0:1]; // bonus count for next 2 throws
    
    reg [2:0] state;
    parameter // s means state
        s_idle = 0,
        s_add_score = 1,
        s_extra = 2,
        s_extra_add_score = 3,
        s_done = 4;
    
    always @(negedge clock, posedge reset) begin
        if (reset) begin
            FT <= 1;
            AD <= 0;
            NF <= 0;
            Done <= 0;
            bonus_count[0] <= 0;
            bonus_count[1] <= 0;
            state <= s_idle;
        end
        else begin
            case (state)
                s_idle: begin
                    AD <= 0;
                    NF <= 0;
                    if (UPD) state <= s_add_score;
                end
                s_add_score: begin
                    AD <= 1;
                    if (bonus_count[0] != 0) bonus_count[0] <= bonus_count[0] - 1;
                    else begin
                        bonus_count[0] <= bonus_count[1] + APD; // strike or spare
                        bonus_count[1] <= APD & FT; // strike
                        FT <= (APD | ~FT) & ~LF;
                        NF <= (APD | ~FT) & ~LF;
                        if (LF & ~FT & ~APD) state <= s_done;
                        else if (LF & APD) state <= s_extra;
                        else state <= s_idle;
                    end
                end
                s_extra: begin
                    AD <= 0;
                    if (UPD) state <= s_extra_add_score;
                end
                s_extra_add_score: begin
                    AD = 0;
                    if (bonus_count[0] != 0) begin
                        AD = 1;
                        bonus_count[0] <= bonus_count[0] - 1;
                    end
                    else if (bonus_count[1] != 0) begin
                        bonus_count[0] <= bonus_count[1];
                        bonus_count[1] <= 0;
                        state <= s_extra;
                    end
                    else state <= s_done;
                end
                s_done: begin
                    AD <= 0;
                    Done <= 1;
                end
                default: state <= s_idle;
            endcase
        end
    end
endmodule

module APD_Logic(
    output APD,    // all pins down
    input [3:0] N, // number of pins knocked down
    input FT,      // first throw
    input clock    // posedge
);
    reg [3:0] knocked_down_count;
    
    assign APD = (knocked_down_count == 10) | (knocked_down_count + N == 10);
    
    always @(posedge clock) begin
        if (FT) knocked_down_count <= N;
    end
endmodule

module Score_Register(
    output reg [8:0] score,
    input [3:0] N, // number of pins knocked down
    input AD,      // add score
    input clock,   // posedge
    input reset    // posedge, poslevel
);
    always @(posedge clock, posedge reset) begin
        if (reset) score <= 0;
        else if (AD) score <= score + N;
    end
endmodule

module Frame_Counter(
    output LF,   // last frame
    input NF,    // new frame
    input clock, // posedge
    input reset  // posedge, poslevel
);
    reg [3:0] frame_count;
    
    assign LF = frame_count == 10;
    
    always @(posedge clock, posedge reset) begin
        if (reset) frame_count <= 1;
        else if (NF) frame_count <= frame_count + 1;
    end
endmodule