module BCD_to_Seven_Segment(
    output reg [0:7] out, // a, b, c, d, e, f, g, dp
    input [3:0] in
);
    always @(in) begin
        case (in)
            0: out <= 8'b11111100;
            1: out <= 8'b01100000;
            2: out <= 8'b11011010;
            3: out <= 8'b11110010;
            4: out <= 8'b01100110;
            5: out <= 8'b10110110;
            6: out <= 8'b10111110;
            7: out <= 8'b11100000;
            8: out <= 8'b11111110;
            9: out <= 8'b11110110;
            default: out <= 0;
        endcase
    end
endmodule