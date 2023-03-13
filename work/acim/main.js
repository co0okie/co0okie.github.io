{

// 角度轉徑度
// d: 角度 degree
// rad: 徑度 radian
function deg(d) { return d * Math.PI / 180 }

// r∠a°轉(x, y)
// r: 半徑 radius
// a: 角度 angle
function ra(r, a) {
    return [r * Math.cos(deg(a)),
            r * Math.sin(deg(a))];
}

// 導體 conductor
// r: 半徑 radius
// a: 角度 angle
// i: 電流大小(-1 ~ 1)
function conductor(r, a, i) {
    // 圓圈邊
    context.beginPath();  
    let [x, y] = ra(r, a);
    context.arc(x, y, 15, 0, deg(360));
    context.stroke();
    
    // 圓圈內
    context.globalAlpha = Math.abs(i);
    context.beginPath();
    if (i > 0) {
        // 一點(流出紙面)
        context.arc(x, y, 6, 0, deg(360));
        context.fill();
    } else {
        // 叉叉(流入紙面)
        [xx, yy] = ra(15, 45);
        context.moveTo(x + xx, y + yy);
        context.lineTo(x - xx, y - yy);
        context.moveTo(x - xx, y + yy);
        context.lineTo(x + xx, y - yy);
        context.stroke();
    }
    context.globalAlpha = 1;
}

// 磁場(箭頭) magnetic field
// r: 半徑 radius
// v: 向量 vector
// a: 角度 angle
function field(r, v, a) {
    // 三角形高
    const arrowSize = context.lineWidth * 10;
    let h = v > 0 ? arrowSize : -arrowSize;
    if (Math.abs(v) < arrowSize) h = v;
    // h = Math.abs(v) < arrowSize ? v : h;
    
    // 線段
    context.beginPath();
    context.moveTo(...ra(r - v, a));
    context.lineTo(...ra(r + v - h, a));
    context.stroke();
    
    // 三角形
    context.beginPath();
    let [x, y] = ra(r + v, a);
    context.moveTo(x, y);
    let l = h / Math.cos(deg(20));
    let xx, yy;
    [xx, yy] = ra(l, a + 160);
    context.lineTo(x + xx, y + yy);
    [xx, yy] = ra(l, a - 160);
    context.lineTo(x + xx, y + yy);
    context.fill();
}


let p = 4; // 極數
let ot = 0; // ωt
const color = ["#F22", "#22F", "#2F2", "#FFF"];
function draw() {
    context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height); // 清空畫布
    
    // 旋轉磁場
    context.strokeStyle = color[3];
    context.fillStyle = color[3];
    context.lineWidth = 3;
    for (let i = 0; i < p; i++) {
        field(
            300 * Math.cos(deg(180 / p)),
            (100 + 100 * Math.cos(deg(120 / p))) * (i % 2 ? -1 : 1),
            (i - 1) * 360 / p + ot / (p / 2)
        );
    }
    
    // 紅R: sin(ωt + 0°);
    // 綠G: sin(ωt - 120°);
    // 藍B: sin(ωt - 240°);
    context.lineWidth = 2;
    for (let i = 0; i < p * 3; i++) {
        context.strokeStyle = color[i % 3];
        context.fillStyle = color[i % 3];
        
        // 導體
        conductor(
            300,
            i * 120 / p,
            Math.sin(deg(ot - i * 60))
        )
        
        // 各相磁場
        field(
            300 * Math.cos(deg(180 / p)),
            100 * Math.sin(deg(ot - i * 60)),
            - 180 / p + i * 120 / p
        );
    }
}

function setCanvasSize() {
    canvas.style.width = canvas.style.height
    = Math.min(MAIN.offsetWidth, MAIN.offsetHeight) + 'px';
}

let inc = 5;
let animate = false;
let counter;
function onKeyDown(e) {
    switch (e.code) {
    case 'Space':
        animate = !animate;
        if (animate) {
            counter = setInterval(() => {
                ot += inc / 10;
                while (ot < 0) ot += 360;
                while (ot >= 360) ot -= 360;
                console.log('draw');
                draw();
            }, 10);
        } else {
            clearInterval(counter);
        }
        break;
    case 'ArrowDown':
        if (p > 2) p -= 2;
        break;
    case 'ArrowUp':
        if (p < 20) p += 2;
        break;
    case 'ArrowLeft':
        if (animate) {
            inc--;
        } else {
            ot -= 5;
            while (ot < 0) ot += 360;
        }
        break;
    case 'ArrowRight':
        if (animate) {
            inc++;
        } else {
            ot += 5;
            while (ot >= 360) ot -= 360;
        }
        break;
    }
    draw();
}

/** @type {HTMLCanvasElement} */
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

MAIN.appendChild(canvas);

canvas.width = 1000;
canvas.height = 1000;
setCanvasSize();

context.transform(1, 0, 0, -1, canvas.width / 2, canvas.height / 2);

document.addEventListener('keydown', onKeyDown);
window.addEventListener('resize', setCanvasSize);

// exit
document.addEventListener('cd', () => {
    console.log('clear');
    clearInterval(counter);
    document.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('resize', setCanvasSize);
}, { once: true });

draw();

}