module tb_Binary_to_BCD();
    wire [3:0] hundreds, tens, units;
    reg [8:0] in;
    
    Binary_to_BCD M1(hundreds, tens, units, in);
    
    initial begin
        in = 1;
        repeat (513)
            #10 in = {in[7:0], in[8] ^ in[4]}; // LFSR psuedorandom number
        $finish;
    end
endmodule