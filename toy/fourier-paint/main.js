import AnimationController from "../../lib/AnimationController.js";
import List from "../../lib/List.js";

////////// constant //////////

const PI2 = Math.PI * 2;

////////// pure function //////////

/**
 * x in [a, b)
 * @param {number} a 
 * @param {number} b 
 * @param {number} n 
 * @returns {number[]}
 */
function linspace(a, b, n) {
    const x = Array(n), m = (b - a) / n;
    for (let i = 0; i < n; i++) {
        x[i] = m * i + a;
    }
    return x;
}

/**
 * 
 * @param {number} t20 - t2 - t0
 * @param {number} t21 - t2 - t1
 * @param {number} t31 - t3 - t1
 * @param {number[4]} p - length 4
 * @returns {[a0, a1, a2, a3]} - p(t) = a0 + a1*t + a2*t² + a3*t³, 0 <= t <= t21
 */
function catmullRomCoef(t20, t21, t31, [p0, p1, p2, p3]) {
    const m20 = (p2 - p0) / t20;
    const m21 = (p2 - p1) / t21;
    const m31 = (p3 - p1) / t31;
    
    return [
        p1,
        m20,
        (-2 * m20 - m31 + 3 * m21) / t21,
        (m21 + m31 - 2 * m21) / t21 / t21
    ];
}

/**
 * Circular Catmull-Rom Spline Interpolation
 * @param {number[]} xi length li
 * @param {number[]} yi length li
 * @param {number[]} ti length li
 * @param {number} lo interpolation count (length output)
 * @returns {[xo: number[], yo: number[], to: number[]]} [xo, yo, to]: length lo
 */
function catmullRomInterpolateN(x, y, t, lo) {
    const li = t.length;
    if (x.length !== li || y.length !== li) throw new Error('x/y/t length mismatch');
    if (li === 0) throw new Error("Empty input");
    for (let i = 1; i < li; i++) if (t[i - 1] >= t[i]) throw Error('Non-ascending t')
    if (li === 1) return [Array(lo).fill(x[0]), Array(lo).fill(y[0]), Array(lo).fill(t[0])];
    
    // p0, p1, ..., p-2, p-1, p0      , p1                , ...
    // t0, t1, ..., t-2, t-1, t-1 + dt, t-1 + dt + t1 - t0, ...
    const averageDeltaT = (t[li - 1] - t[0]) / (li - 1);
    const xi = [...x, x[0], x[1]];
    const yi = [...y, y[0], y[1]];
    const ti = [...t, t[li - 1] + averageDeltaT, t[li - 1] + averageDeltaT + t[1] - t[0]];
    let [t0, t1, t2, t3] = [ti[0] - averageDeltaT, ti[0], ti[1], ti[2]];
    let [x0, x1, x2, x3] = [xi[li - 1], xi[0], xi[1], xi[2]];
    let [y0, y1, y2, y3] = [yi[li - 1], yi[0], yi[1], yi[2]];
    let cx = catmullRomCoef(t2 - t0, t2 - t1, t3 - t1, [x0, x1, x2, x3]);
    let cy = catmullRomCoef(t2 - t0, t2 - t1, t3 - t1, [y0, y1, y2, y3]);
    const xo = Array(lo), yo = Array(lo), to = linspace(ti[0], ti[li], lo);
    for (let io = 0, ii = 0; io < lo; io++) {
        while (to[io] > ti[ii + 1]) {
            ii++;
            if (to[io] > ti[ii + 1]) continue;
            [t0, t1, t2, t3] = [t1, t2, t3, ti[ii + 2]];
            [x0, x1, x2, x3] = [x1, x2, x3, xi[ii + 2]];
            [y0, y1, y2, y3] = [y1, y2, y3, yi[ii + 2]];
            cx = catmullRomCoef(t2 - t0, t2 - t1, t3 - t1, [x0, x1, x2, x3]);
            cy = catmullRomCoef(t2 - t0, t2 - t1, t3 - t1, [y0, y1, y2, y3]);
        }
        const t = to[io] - t1;
        xo[io] = cx[0] + t * (cx[1] + t * (cx[2] + t * cx[3]));
        yo[io] = cy[0] + t * (cy[1] + t * (cy[2] + t * cy[3]));
    }
    return [xo, yo, to];
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
    circleCount: 1,
    reset: () => {
        config.trace = false;
        config.zoom = 1;
        config.circleCount = 1;
    }
}


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
        case 'ArrowUp':
            config.circleCount += 1 / 16;
            if (config.circleCount > 1) config.circleCount = 1;
            break;
        case 'ArrowDown':
            config.circleCount -= 1 / 16;
            if (config.circleCount < 0) config.circleCount = 0;
            break;
    }
});

function client2Canvas(x, y) {
    return {x: x - canvas.width / 2, y: y - canvas.height / 2};
}

document.addEventListener('mypointerdown', (
    /** @type {{detail: {t: number, x: number, y: number}}} */
    { detail: {t, x, y} }
) => {
    initCanvas();
    config.reset();
    context.lineWidth = 3;
    context.globalAlpha = 1;
    context.beginPath();
    context.moveTo(x, y);
})

document.addEventListener('mypointermove', (
    /** @type {{detail: {t: number, x: number, y: number}}} */
    { detail: {t, x, y} }
) => {
    context.lineTo(x, y);
    context.stroke();
})

document.addEventListener('mypointerup', (
    /** @type {{detail: {t: number, x: number, y: number}[]}} */
    { detail: oldPoints }
) => {
    const x = oldPoints.map(({x}) => x), y = oldPoints.map(({y}) => y), t = oldPoints.map(({t}) => t);
    const N = 2 ** Math.ceil(Math.log2(t.length * 16));
    const T0 = (t[t.length - 1] - t[0]) * N / (N - 1);
    const f0 = N / T0;
    const [sx, sy] = catmullRomInterpolateN(x, y, t, N);
    const {X, Y} = FFT(sx, sy);
    const {r: RN, θ: Θ} = cartesian2Polar(X, Y);
    const R = RN.map(r => r / N);
    /** @type {List<{x: number, y: number, t: number}>} */
    let points = new List();
    const animation = new AnimationController((elapse, pause) => {
        context.save();
        context.resetTransform();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
        
        let x = 0, y = 0;
        const PI2n_N = PI2 * elapse * f0 / N;
        const circlePath = new Path2D();
        const linePath = new Path2D();
        linePath.moveTo(0, 0);
        // N = 16, k = 0, 15, 1, 14, 2, 13, 3, 12, 4, 11, 5, 10, 6, 9, 7, 8
        for (
            let i = 0, k = 0, N_2 = N / 2, iEnd = (N / 16) ** config.circleCount;
            i < iEnd; 
            i++, k = N - k - (k < N_2)
        ) {
            const r = R[k];
            const a = Θ[k];
            circlePath.moveTo(x + r, y);
            circlePath.arc(x, y, r, 0, PI2);
            // 2πkn/N = 2πktf0/N = 2πt/T0 * k
            const θ = a + PI2n_N * (k >= N_2 ? k - N : k);
            x += r * Math.cos(θ);
            y += r * Math.sin(θ);
            linePath.lineTo(x, y);
        }
        
        if (config.trace) {
            context.lineWidth = 1 / config.zoom;
            context.setTransform(config.zoom, 0, 0, config.zoom, canvas.width / 2, canvas.height / 2);
            context.transform(1, 0, 0, 1, -x, -y);
        } else {
            context.lineWidth = 1;
            context.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);
        }
        context.globalAlpha = 0.3;
        context.beginPath();
        context.stroke(circlePath);
        context.globalAlpha = 0.8;
        context.beginPath();
        context.stroke(linePath);
        
        if (!pause) {
            points.push({x: x, y: y, t: elapse});
            points = points.extract(({t}) => elapse - t <= T0);
        }
        
        context.lineWidth = config.trace ? 3 / config.zoom : 3;
        if (points.head) for (let node = points.head.next, i = 1, l = points.length; node; node = node.next, i++) {
            context.globalAlpha = i / l;
            context.beginPath();
            context.moveTo(node.prev.value.x, node.prev.value.y);
            context.lineTo(node.value.x, node.value.y);
            context.stroke();
        }
    });
    
    /**
     * @param {KeyboardEvent} e 
     */
    const keydownHandler = e => {
        switch (e.code) {
            case 'ArrowRight':
                animation.speedUp();
                break;
            case 'ArrowLeft':
                animation.slowDown();
                break;
            case 'Space':
                animation.togglePause();
                break;
        }
    }
    
    document.addEventListener('keydown', keydownHandler);
    
    mouseLeftDown().then(() => {
        animation.stop();
        document.removeEventListener('keydown', keydownHandler);
    });
})

{
    let pointerPressed = false;
    /** @type {{t: number, x: number, y: number}[]} */
    let points;
    /** @type {number} */
    let startTime;
    
    document.addEventListener('pointerdown', e => {
        if (pointerPressed) return;
        pointerPressed = true;
        const point = {t: 0, ...client2Canvas(e.x, e.y)}
        points = [point];
        startTime = performance.now() / 1000;
        document.dispatchEvent(new CustomEvent("mypointerdown", { detail: point }));
    })
    
    document.addEventListener('pointermove', e => {
        if (!pointerPressed) return;
        const lastT = points.at(-1).t;
        const newT = performance.now() / 1000 - startTime;
        const point = {t: lastT < newT ? newT : lastT + 2**-10, ...client2Canvas(e.x, e.y)}
        points.push(point);
        document.dispatchEvent(new CustomEvent("mypointermove", { detail: point }));
    })
    
    const onPointerAbort = e => {
        if (!pointerPressed) return;
        pointerPressed = false;
        document.dispatchEvent(new CustomEvent("mypointerup", { detail: points }));
    }
    
    document.addEventListener('pointerup', onPointerAbort);
    document.addEventListener('pointercancel', onPointerAbort);
    document.addEventListener('blur', onPointerAbort);
    document.addEventListener('contextmenu', onPointerAbort);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) onPointerAbort();
    });
}