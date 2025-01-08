'use strict'

////////// constant //////////

const PI2 = Math.PI * 2;

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
 * @param {number} n interpolation count
 * @returns {[number[], number[]]} [xx, yy, tt]: length n
 */
function interpolateN(x, y, t, n) {
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
 * @param {number[]} x - length n
 * @param {number[]} y - length n
 * @returns {{r: number[], θ: number[]}}
 */
function cartesian2Polar(x, y) {
    const n = x.length;
    if (n !== y.length) throw new Error('x and y must have the same length');
    const r = Array(n), θ = Array(n);
    for (let i = 0; i < n; i++) {
        r[i] = Math.sqrt(x[i] * x[i] + y[i] * y[i]);
        θ[i] = Math.atan2(y[i], x[i]);
    }
    return {r: r, θ: θ};
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

/**
 * https://stackoverflow.com/questions/60226845/reverse-bits-javascript
 * 
 * e.g. logn = 4 bits
 * 0000 -> 0000
 * 0001 -> 1000
 * 0010 -> 0100
 * 0011 -> 1100
 * ...
 * 
 * @param {number} x - an integer
 * @param {number} logn - bit length
 * @returns {number} - reversed integer
 */
function rev(x, logn) {
    x = ((x >> 1) & 0x55555555) | ((x & 0x55555555) << 1);
    x = ((x >> 2) & 0x33333333) | ((x & 0x33333333) << 2);
    x = ((x >> 4) & 0x0F0F0F0F) | ((x & 0x0F0F0F0F) << 4);
    x = ((x >> 8) & 0x00FF00FF) | ((x & 0x00FF00FF) << 8);
    x = (x >>> 16) | (x << 16);

    return x >>> (32 - logn);
}

/**
 * 
 * @param {number[]} x - length n
 * @param {number[]} y - length n
 * @param {number} logn - n = 2^logn
 * @returns {{x: number[], y: number[]}}
 */
function bitReverseCopy(x, y, logn) {
    const n = 2 ** logn;
    const out = {x: Array(n), y: Array(n)};
    for (let i = 0; i < n; i++) {
        out.x[i] = x[rev(i, logn)];
        out.y[i] = y[rev(i, logn)];
    }
    return out;
}

/**
 * complex multiplication
 * z1 = x1 + jy1
 * z2 = x2 + jy2
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 * @returns {[number, number]} - z = x + jy
 */
function multiply(x1, y1, x2, y2) {
    return [x1 * x2 - y1 * y2, x1 * y2 + y1 * x2];
}

/**
 * reference: https://en.wikipedia.org/wiki/Cooley–Tukey_FFT_algorithm#Data_reordering,_bit_reversal,_and_in-place_algorithms
 * 
 * j^2 = -1
 * z = x + jy
 * @param {number[]} x - length n
 * @param {number[]} y - length n
 * @param {1 | -1} sign - FFT: 1, IFFT: -1
 * @returns {{X: number[], Y: number[]}} - Z = X + jY
 */
function __FFT(x, y, sign) {
    const n = x.length;
    if (n !== y.length) throw new Error('x and y must have the same length');
    if (n === 0) return {X: [], Y: []};
    const logn = Math.log2(n);
    if (Number.isInteger(logn) === false) throw new Error('n must be a power of 2');
    if (sign !== 1 && sign !== -1) throw new Error('sign must be 1 or -1');
    
    const {x: X, y: Y} = bitReverseCopy(x, y, logn);
    for (let s = 1; s <= logn; s++) {
        const m = 2 ** s;
        // ωm = exp(−j2π/m)
        const twoPI_m = sign * 2 * Math.PI / m;
        for (let k = 0; k < n; k += m) {
            for (let i = 0; i < m / 2; i++) {
                // ω = ωm ** i = exp(−j2π/m) ** i = exp(−j2πi/m) = cos(2πi/m) - jsin(2πi/m)
                const ωx = Math.cos(twoPI_m * i), ωy = -Math.sin(twoPI_m * i);
                const [tx, ty] = multiply(ωx, ωy, X[k + i + m / 2], Y[k + i + m / 2]);
                const ux = X[k + i], uy = Y[k + i];
                X[k + i] = ux + tx;
                Y[k + i] = uy + ty;
                X[k + i + m / 2] = ux - tx;
                Y[k + i + m / 2] = uy - ty;
            }
        }
    }
    
    if (sign === -1) {
        for (let i = 0; i < n; i++) {
            X[i] /= n;
            Y[i] /= n;
        }
    }
    
    return sign === 1 ? {X: X, Y: Y} : {x: X, y: Y};
}

/**
 * z = x + jy
 * @param {number[]} x - length n
 * @param {number[]} y - length n
 * @returns {{X: number[], Y: number[]}} - Z = X + jY
 */
function FFT(x, y) {
    return __FFT(x, y, 1);
}

/**
 * Z = X + jY
 * @param {number[]} X - length n
 * @param {number[]} Y - length n
 * @returns {{x: number[], y: number[]}} - z = x + jy
 */
function IFFT(X, Y) {
    return __FFT(X, Y, -1);
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

/**
 * @param {(elapse: number) => void} animation 
 * @returns {Promise<AbortController>}
 */
async function startAnimation(animation) {
    const controller = new AbortController();
    let stop = false;
    controller.signal.addEventListener('abort', () => stop = true);
    const t_offset = await new Promise(r => requestAnimationFrame(r)) / 1000;
    requestAnimationFrame(function callback(now) {
        if (stop) return;
        animation(now / 1000 - t_offset);
        requestAnimationFrame(callback);
    });
    return controller;
}

function initCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    context.translate(canvas.width / 2, canvas.height / 2);
    context.strokeStyle = '#fff';
    context.lineCap = "butt";
}

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

const config = {
    trace: false,
    zoom: 1,
    speed: 1,
    pause: false,
    circleCount: 1,
    reset: () => {
        config.trace = false;
        config.zoom = 1;
        config.speed = 1;
        config.pause = false;
        config.circleCount = 1;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    document.body.append(canvas);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    initCanvas();
    
    window.addEventListener('resize', initCanvas);
    
    document.addEventListener('keydown', async e => {
        switch (e.code) {
            case 'KeyH':
                const help = document.getElementById('help');
                help.classList.toggle('hidden');
                break;
            case 'KeyT':
                config.trace = !config.trace;
                break;
            case 'KeyW':
                config.zoom *= 1.1;
                break;
            case 'KeyS':
                config.zoom /= 1.1;
                break;
            case 'ArrowRight':
                config.speed *= 1.1;
                break;
            case 'ArrowLeft':
                config.speed /= 1.1;
                break;
            case 'ArrowUp':
                config.circleCount += 1 / 16;
                if (config.circleCount > 1) config.circleCount = 1;
                break;
            case 'ArrowDown':
                config.circleCount -= 1 / 16;
                if (config.circleCount < 0) config.circleCount = 0;
                break;
            case 'Space':
                config.pause = !config.pause;
                break;
        }
    });
        
    for (;;) {
        const e0 = await mouseLeftDown();
        const x = [e0.clientX - canvas.width / 2], y = [e0.clientY - canvas.height / 2], t = [0];
        let t_offset = performance.now() / 1000;
        initCanvas();
        config.reset();
        
        context.lineWidth = 3;
        context.globalAlpha = 1;
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
        
        // const N = 2 * Math.round(50 * (t[t.length - 1] - t[0])); // f_max * T_0
        const N = 2 ** Math.ceil(Math.log2(t.length * 16));
        console.log(N);
        const T0 = (t[t.length - 1] - t[0]) * N / (N - 1);
        const f0 = N / T0;
        const [sx, sy] = interpolateN(x, y, t, N);
        // const [X, Y, n, T] = FS(sx, sy, st, range(-N/2, N/2));
        const {X, Y} = FFT(sx, sy);
        const {r: RN, θ: Θ} = cartesian2Polar(X, Y);
        const R = RN.map(r => r / N);
        /** @type {{x: number, y: number, t: number}[]} */
        const points = [];
        const animation = await startAnimation(elapse => {
            context.save();
            context.resetTransform();
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.restore();
            
            let x = 0, y = 0;
            const PI2n_N = PI2 * Math.round(elapse * f0) / N; // n = round(t * f0)
            const path = new Path2D();
            // N = 16, k = 0, 15, 1, 14, 2, 13, 3, 12, 4, 11, 5, 10, 6, 9, 7, 8
            for (
                let i = 0, k = 0, N_2 = N / 2, iEnd = N ** config.circleCount; 
                i < iEnd; 
                i++, k = N - k - (k < N_2)
            ) {
                const r = R[k];
                const a = Θ[k];
                path.moveTo(x + r, y);
                path.arc(x, y, r, 0, PI2);
                path.moveTo(x, y);
                // 2πkn/N = 2πktf0/N = 2πt/T0 * k
                const θ = a + PI2n_N * k;
                x += r * Math.cos(θ);
                y += r * Math.sin(θ);
                path.lineTo(x, y);
            }
            context.lineWidth = 0.5 / config.zoom;
            context.globalAlpha = 0.5;
            if (config.trace) {
                context.setTransform(config.zoom, 0, 0, config.zoom, canvas.width / 2, canvas.height / 2);
                context.transform(1, 0, 0, 1, -x, -y);
            } else {
                context.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);
            }
            context.beginPath();
            context.stroke(path);
            
            // const [[x], [y], [t]] = IFS(X, Y, N, T, [elapse]);
            points.push({x: x, y: y, t: elapse});
            points.splice(0, points.findIndex(({t}) => elapse - t <= T0) - 1);
            
            context.lineWidth = 3 / config.zoom;
            for (let i = 1, l = points.length; i < l; i++) {
                context.globalAlpha = 0.2 + 0.8 * i / l;
                context.beginPath();
                context.moveTo(points[i - 1].x, points[i - 1].y);
                context.lineTo(points[i].x, points[i].y);
                context.stroke();
            }
        });
        mouseLeftDown().then(() => animation.abort());
    }
});