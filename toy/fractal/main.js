const canvas = document.createElement('canvas');
canvas.style.width = `${window.innerWidth * 0.8}px`;
canvas.style.height = `${window.innerHeight * 0.8}px`;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const context = canvas.getContext('2d');

/**
 * 
 * @param {number} x left
 * @param {number} y top
 * @param {number} size 
 * @param {number} minSize stop condition
 * @param {number} a11 basis 1 x
 * @param {number} a21 basis 1 y
 * @param {number} a12 basis 2 x
 * @param {number} a22 basis 2 y
 */
function hilbertCurve(x, y, size, minSize, a11, a21, a12, a22) {
    if (size <= minSize) {
        context.lineTo(x + size * (1 / 4 * a11 + 1 / 4 * a12), y + size * (1 / 4 * a21 + 1 / 4 * a22));
        context.lineTo(x + size * (1 / 4 * a11 + 3 / 4 * a12), y + size * (1 / 4 * a21 + 3 / 4 * a22));
        context.lineTo(x + size * (3 / 4 * a11 + 3 / 4 * a12), y + size * (3 / 4 * a21 + 3 / 4 * a22));
        context.lineTo(x + size * (3 / 4 * a11 + 1 / 4 * a12), y + size * (3 / 4 * a21 + 1 / 4 * a22));
        return;
    }

    hilbertCurve(x, y, size / 2, minSize, a12, a22, a11, a21);
    hilbertCurve(x + size / 2 * a12, y + size / 2 * a22, size / 2, minSize, a11, a21, a12, a22);
    hilbertCurve(x + size / 2 * (a11 + a12), y + size / 2 * (a21 + a22), size / 2, minSize, a11, a21, a12, a22);
    hilbertCurve(x + size * (a11 + a12 / 2), y + size * (a21 + a22 / 2), size / 2, minSize, -a12, -a22, -a11, -a21);
}


context.beginPath();
hilbertCurve(0, 0, Math.min(canvas.width, canvas.height), 10, 1, 0, 0, 1);
context.stroke();