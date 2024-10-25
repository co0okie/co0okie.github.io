'use strict'

////////// pure function //////////

/**
 * @param {number} a 
 * @param {number} b 
 * @param {number} n 
 * @returns 
 */
function linspace(a, b, n) {
    const x = Array(n), m = (b - a) / (n - 1);
    for (let i = 0; i < n; i++) {
        x[i] = m * i + a;
    }
    return x;
}

function range(a, b) {
    const l = b - a + 1, x = Array(l);
    for (let i = 0; i < l; i++) {
        x[i] = a + i;
    }
    return x;
}

function compare(x, y) {
    return x.reduce((a, b, i) => a + Math.abs(y[i] - b), 0);
}

/**
 * (t1, x1), (t2, x2)
 * (t - t1)(x2 - x1) = (x - x1)(t2 - t1)
 * x = (t - t1)(x2 - x1) / (t2 - t1) + x1
 * @param {number[]} x length l
 * @param {number[]} y length l
 * @param {number[]} t length l
 * @param {number} n sample count
 * @returns {[number[], number[]]} [xx, yy, tt]: length n
 */
function sample(x, y, t, n) {
    const l = t.length;
    const xx = Array(n), yy = Array(n), tt = linspace(t[0], t[l - 1], n);
    let ti = 0, t1 = t[ti], t2 = t[ti + 1];
    if (t2 === 0) t2 = (t1 + t[ti + 2]) / 2;
    let x1 = x[ti], x2 = x[ti + 1], mx = (x2 - x1) / (t2 - t1);
    let y1 = y[ti], y2 = y[ti + 1], my = (y2 - y1) / (t2 - t1);
    for (let i = 0; i < n; i++) {
        while (tt[i] > t2) {
            ti++;
            t1 = t2, t2 = t[ti + 1], x1 = x2, x2 = x[ti + 1], y1 = y2, y2 = y[ti + 1];
            mx = (x2 - x1) / (t2 - t1);
            my = (y2 - y1) / (t2 - t1);
        }
        xx[i] = (tt[i] - t1) * mx + x1;
        yy[i] = (tt[i] - t1) * my + y1;
    }
    return [xx, yy, tt];
}

/**
 * y = x[0 ~ n - 2] + x[1 ~ n - 1]
 * @param {number[]} x length n
 * @returns {number[]} length n - 1
 */
function mid2(x) {
    const l = x.length - 1;
    const y = Array(l);
    for (let i = 0; i < l; i++) {
        y[i] = x[i] + x[i + 1];
    }
    return y;
}

/**
 * y = x[1 ~ n - 1] - x[0 ~ n - 2]
 * @param {number[]} x length n
 * @returns {number[]} length n - 1
 */
function diff(x) {
    const l = x.length - 1;
    const y = Array(l);
    for (let i = 0; i < l; i++) {
        y[i] = x[i + 1] - x[i];
    }
    return y;
}

/**
 * Trapezoidal Integration ∫ y dx
 * 
 * @param {number[]} x length n
 * @param {number[]} y length n
 * @returns {number}
 */
function integral(x, y) {
    const midy = mid2(y), dx = diff(x);
    let sum = 0;
    for (let i = 0, l = dx.length; i < l; i++) {
        sum += midy[i] * dx[i];
    }
    return sum / 2;
}

/**
 * T = t[nt - 1] - t[0]
 * f = 1 / T
 * 
 * Z[n] = 1/T * ∫z(t) * exp(-j2πnft) dt
 *      = 1/T * ∫(x(t) + jy(t)) * (cos(-2πnft) + jsin(-2πnft)) dt
 *      = 1/T * ∫(x(t) + jy(t)) * (cos(2πnft) - jsin(2πnft)) dt
 *      = 1/T * ∫(x(t) + jy(t)) * (cos(2πnft) - jsin(2πnft)) dt
 *      = 1/T * ∫((x(t)cos(2πnft) + y(t)sin(2πnft)) + j(y(t)cos(2πnft) - x(t)sin(2πnft))) dt
 *      = 1/T * ∫(x(t)cos(2πnft) + y(t)sin(2πnft)) dt + j/T * ∫(y(t)cos(2πnft) - x(t)sin(2πnft)) dt
 *      = 1/T * ∫ X_(t) dt + 1/T * j∫ Y_(t) dt
 *      = X[n] + jY[n]
 * 
 * @param {number[]} x length nt
 * @param {number[]} y length nt
 * @param {number[]} t length nt
 * @param {number[]} n length nn
 * @returns {[number[], number[], number[], number[]]} [X, Y, n, T]: Z[n] = X[n] + jY[n], f = n / T
 */
function FS(x, y, t, n) {
  const nt = t.length, nn = n.length, T = t[nt - 1] - t[0], f = 1 / T;
  const p2f = Math.PI * 2 * f;
  const X = Array(nn).fill(0), Y = Array(nn).fill(0);
  for (let ni = 0; ni < nn; ni++) {
    const p2fn = p2f * n[ni];
    const X_ = Array(nt), Y_ = Array(nt);
    for (let ti = 0; ti < nt; ti++) {
        const p2fnt = p2fn * t[ti];
        const cp2fnt = Math.cos(p2fnt);
        const sp2fnt = Math.sin(p2fnt);
        X_[ti] = x[ti] * cp2fnt + y[ti] * sp2fnt;
        Y_[ti] = y[ti] * cp2fnt - x[ti] * sp2fnt;
    }
    X[ni] = integral(t, X_) / T;
    Y[ni] = integral(t, Y_) / T;
  }
  
  return [X, Y, n, T];
}

/**
 * z(t) = ∑(Z[n] * exp(j2πnft))
 *      = ∑((X[n] + jY[n]) * (cos(2πnft) + jsin(2πnft)))
 *      = ∑(X[n]cos(2πnft) - Y[n]sin(2πnft)) + j∑(X[n]sin(2πnft) + Y[n]cos(2πnft))
 *      = x(t) + jy(t)
 * 
 * @param {number[]} X length nn
 * @param {number[]} Y length nn
 * @param {number[]} n length nn
 * @param {number} T
 * @param {number[]} t length nt
 * @returns {[number[], number[], number[]]} [x, y, t]: z(t) = x(t) + jy(t)
 */
function IFS(X, Y, n, T, t) {
    const nn = n.length, nt = t.length, f = 1 / T;
    const p2f = Math.PI * 2 * f;
    const x = Array(nt).fill(0), y = Array(nt).fill(0);
    for (let ti = 0; ti < nt; ti++) {
        const p2ft = p2f * t[ti];
        for (let ni = 0; ni < nn; ni++) {
            const cp2ftn = Math.cos(p2ft * n[ni]);
            const sp2ftn = Math.sin(p2ft * n[ni]);
            x[ti] += X[ni] * cp2ftn - Y[ni] * sp2ftn;
            y[ti] += X[ni] * sp2ftn + Y[ni] * cp2ftn;
        }
    }
    return [x, y, t];
}

////////// input function //////////

/**
 * @param {string} type 
 * @returns {Promise<Event>}
 */
function untilEvent(type) {
    return new Promise(r => document.addEventListener(type, r, { once: true }));
}

/** @returns {Promise<MouseEvent>} */
async function mouseLeftDown() {
    for (;;) {
        const e = await untilEvent('mousedown');
        if (e.button === 0) return e;
    }
}

/** @returns {Promise<MouseEvent>} */
async function mouseLeftUp() {
    for (;;) {
        const e = await untilEvent('mouseup');
        if (e.button === 0) return e;
    }
}

async function startAnimation(animation) {
    const control = { stop: false };
    const t_offset = await new Promise(r => requestAnimationFrame(r)) / 1000;
    requestAnimationFrame(function callback(now) {
        if (control.stop) return;
        animation(now / 1000 - t_offset);
        requestAnimationFrame(callback);
    });
    return control;
}

function initCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    context.translate(canvas.width / 2, canvas.height / 2);
    context.lineWidth = 3;
    context.strokeStyle = '#fff';
}

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

document.addEventListener('DOMContentLoaded', async () => {
    document.body.append(canvas);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    initCanvas();
    
    window.addEventListener('resize', initCanvas);
        
    for (;;) {
        const e0 = await mouseLeftDown();
        const x = [e0.clientX - canvas.width / 2], y = [e0.clientY - canvas.height / 2], t = [0];
        let t_offset = performance.now() / 1000;
        context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        
        /** @param {MouseEvent} e */
        function onMouseMove(e) {
            context.beginPath();
            context.moveTo(x[x.length - 1], y[y.length - 1]);
            const newX = e.clientX - canvas.width / 2, newY = e.clientY - canvas.height / 2;
            context.lineTo(newX, newY);
            context.stroke();
            x.push(newX);
            y.push(newY);
            t.push(performance.now() / 1000 - t_offset);
        }
        document.addEventListener('mousemove', onMouseMove);
        await mouseLeftUp();
        document.removeEventListener('mousemove', onMouseMove);
        
        const N = 2 * Math.round(50 * (t[t.length - 1] - t[0])); // f_max * T_0
        const [sx, sy, st] = sample(x, y, t, N);
        const [X, Y, n, T] = FS(sx, sy, st, range(-N/2, N/2));
        /** @type {{x: number, y: number, t: number}[]} */
        const points = [];
        const animation = await startAnimation(elapse => {
            const [[x], [y], [t]] = IFS(X, Y, n, T, [elapse]);
            points.push({x: x, y: y, t: t});
            points.splice(0, points.findIndex(({t}) => elapse - t <= T) - 1);
            
            context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
            for (let i = 1, l = points.length; i < l; i++) {
                context.globalAlpha = 0.2 + 0.8 * i / l;
                context.beginPath();
                context.moveTo(points[i - 1].x, points[i - 1].y);
                context.lineTo(points[i].x, points[i].y);
                context.stroke();
            }
        });
        mouseLeftDown().then(() => animation.stop = true);
    }
});