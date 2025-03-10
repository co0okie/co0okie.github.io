module tb_BCD_to_Seven_Segment();
    wire [0:7] out;
    reg [3:0] in;
    
    BCD_to_Seven_Segment_Decoder M1(out, in);
    
    initial begin
        in = 0;
        repeat (20) #50 in = in + 1;
        $finish;
    end
endmodule