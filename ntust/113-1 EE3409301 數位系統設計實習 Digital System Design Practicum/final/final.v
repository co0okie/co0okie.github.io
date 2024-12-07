// snake
// led state: empty (dark), snake (light), food (blink), 1 led: 2 bits
// map: 16 * 16 * led = 16 * 16 * 2 bits
// food position: 8 bits, snake position: max_lenth * 8 bits
// clock: 8192 Hz = 2^13 Hz
// ticks: 0.25 s = 4 Hz

module final (
    input 
        clk, // posedge
        reset, // pos level
        up, down, left, right, // snake direction
    output reg [0:15] led_row, led_col,
    output [0:7] 
        seven_segment_tens, 
        seven_segment_units
);
    reg [2:0] state;
    parameter // s = state
        s_refresh_led_matrix = 1,
        s_update_snake = 2,
        s_update_snake_loop = 3,
        s_generate_food = 4,
        s_generate_food_loop = 5,
        s_game_finish = 6;
        
    parameter win_score = 10;
    wire game_win; assign game_win = snake_length == win_score;

    parameter counter_size = 11; // clock (2^13) / tick (2^2) = 2^11
    reg [(counter_size - 1):0] counter;
    reg [1:0] map [0:255];
    parameter m_empty = 0, m_snake = 1, m_food = 2;
    
    reg [7:0] snake [0:(win_score - 1)]; // 0 (head) ~ snake_length - 1 (tail)
    reg [7:0] snake_length;
    reg [7:0] food;

    reg [1:0] snake_direction;
    parameter // d = direction
        d_up = 0, d_down = 1, d_left = 2, d_right = 3;
    
    wire [7:0] snake_head; assign snake_head = snake[0];
    wire [7:0] snake_neck; assign snake_neck = snake[1]; // no neck when snake_length < 2
    wire [7:0] snake_tail; assign snake_tail = snake[snake_length - 1];
    
    wire on_wall_top;    assign on_wall_top    = snake_head      <  16;
    wire on_wall_bottom; assign on_wall_bottom = snake_head      > 239;
    wire on_wall_left;   assign on_wall_left   = snake_head % 16 ==  0;
    wire on_wall_right;  assign on_wall_right  = snake_head % 16 == 15;
    
    wire [7:0] head_top;    assign head_top    = snake_head - 16;
    wire [7:0] head_bottom; assign head_bottom = snake_head + 16;
    wire [7:0] head_left;   assign head_left   = snake_head -  1;
    wire [7:0] head_right;  assign head_right  = snake_head +  1;
    
    wire [7:0] snake_next_head; assign snake_next_head =
        snake_direction == d_up    ? head_top    :
        snake_direction == d_down  ? head_bottom :
        snake_direction == d_left  ? head_left   :
        snake_direction == d_right ? head_right  : 8'bxxxxxxxx;

    reg [7:0] lfsr; // random number generator

    reg seven_segment_en;
    wire [0:7] tens, units;
    bcd_to_7segment (tens, snake_length / 10);
    bcd_to_7segment (units, snake_length % 10);
    assign seven_segment_tens = seven_segment_en ? tens : 8'b0;
    assign seven_segment_units = seven_segment_en ? units : 8'b0;
    
    reg [7:0] i, j, k;

    always @(posedge clk) begin
        lfsr <= lfsr == 0 ? 1 : {lfsr[6:0], lfsr[7] ^ lfsr[5] ^ lfsr[4] ^ lfsr[3]};
        if (reset) begin
            snake_length <= 1;
            snake[0] <= 8 * 16 + 8; // center bottom right
            counter <= 0;
            snake_direction <= d_up;
            seven_segment_en <= 1;
            
            // clear map
            k <= k + 1;
            map[k] <= m_empty;
            
            state <= s_generate_food;
        end
        else begin
            case (state)
                s_refresh_led_matrix: begin
                    led_row <= 16'b1000000000000000 >> counter[3:0]; // 4x16 decoder
                    for (i = 0; i < 16; i = i + 1) begin
                        case (map[counter[3:0] * 16 + i])
                            m_empty: led_col[i] <= 0; // dark
                            m_snake: led_col[i] <= 1; // light
                            m_food: led_col[i] <= counter[counter_size - 1]; // blink
                        endcase
                    end
                    
                    counter = counter + 1;

                    // change direction, prevent go back (head go to neck)
                    if (up && (snake_length == 1 || head_top != snake_neck))
                        snake_direction <= d_up;
                    else if (down && (snake_length == 1 || head_bottom != snake_neck))
                        snake_direction <= d_down;
                    else if (left && (snake_length == 1 || head_left != snake_neck)) 
                        snake_direction <= d_left;
                    else if (right && (snake_length == 1 || head_right != snake_neck)) 
                        snake_direction <= d_right;

                    if (counter == 0) begin // reach game tick
                        if (
                            // if hit wall
                            (snake_direction == d_up && on_wall_top) ||
                            (snake_direction == d_down && on_wall_bottom) ||
                            (snake_direction == d_left && on_wall_left) ||
                            (snake_direction == d_right && on_wall_right) ||
                            // or eat itself
                            (map[snake_next_head] == m_snake && snake_next_head != snake_tail) ||
                            // or win
                            game_win
                        ) begin // then game finish
                            state <= s_game_finish;
                        end
                        else if (map[snake_next_head] == m_food) begin // eat food
                            snake_length <= snake_length + 1;
                            
                            state <= s_generate_food;
                        end
                        else begin // normal move
                            map[snake_tail] <= m_empty; // erase tail
                            
                            state <= s_update_snake;
                        end
                    end
                end
                s_generate_food: begin
                    i <= 0; // map index
                    j <= lfsr % (256 - snake_length);
                    
                    state <= s_generate_food_loop;
                end
                s_generate_food_loop: begin // find index of j-th empty grid, do 1 bit per clock
                    if (j != 0) begin
                        if (map[i] == m_empty) j = j - 1;
                        if (j != 0) i = i + 1;
                    end
                    else begin
                        food = i;
                        map[i] = m_food;
                        
                        state <= s_update_snake;
                    end
                end
                s_update_snake: begin
                    i <= win_score - 1; // shift snake from back
                    
                    state <= s_update_snake_loop;
                end
                s_update_snake_loop: begin // shift 1 bit per clock
                    if (i != 0) begin // prevent snake[-1]
                        snake[i] = snake[i - 1];
                        i = i - 1;
                    end
                    else begin
                        snake[0] <= snake_next_head; // update snake head
                        map[snake_next_head] <= m_snake; // draw new head
                        
                        state <= s_refresh_led_matrix;
                    end
                end
                s_game_finish: begin
                    counter <= counter + 1;
                    seven_segment_en <= counter[counter_size - 1]; // blink effect
                end
            endcase
        end
    end
endmodule

reg
module bcd_to_7segment(
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
        endcase
    end
endmodule