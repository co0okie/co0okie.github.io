module Binary_to_BCD(
    output reg [3:0] hundreds, tens, units,
    input [8:0] in
);
    integer i;
    
    always @(in) begin
        {hundreds, tens, units} = 0;
        
        for (i = 0; i < 9; i = i + 1) begin
            if (units >= 5) units = units + 3;
            if (tens >= 5) tens = tens + 3;
            if (hundreds >= 5) hundreds = hundreds + 3;
            
            {hundreds, tens, units} = {hundreds[2:0], tens, units, in[8-i]};
        end
    end
endmodule