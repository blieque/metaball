// CONSTANTS

const SCALE = 3;
const CIRCLES_PROTOTYPE = [
    { x: 18,  y: 12, r: 7  },
    { x: 40,  y: 70, r: 14 },
    { x: 50,  y: 26, r: 8 },
    { x: 50,  y: 26, r: 8 },
    { x: 68,  y: 66, r: 4 },
    { x: 68,  y: 66, r: 4 },
    { x: 120, y: 40, r: 26 },
];

const TAU = 2 * Math.PI;

// FUNCTIONS

const scaleCanvasToViewport = function scaleCanvasToViewport() {
    let ratioWidth = (window.innerWidth - 16) / canvas.width;
    let ratioHeight = (window.innerHeight - 16) / canvas.height;
    let ratioMin = Math.floor(Math.min(ratioWidth, ratioHeight));
    ratioMin = Math.max(1, ratioMin);
    let pixelWidth = canvas.width * ratioMin;
    canvas.style.width = `${pixelWidth}px`;
};
window.addEventListener('resize', scaleCanvasToViewport);

// RUNTIME

const canvas = document.querySelector('canvas');
canvas.width = SCALE * 160;
canvas.height = SCALE * 90;
scaleCanvasToViewport();

const ctx = canvas.getContext('2d');
ctx.fillStyle = 'lightgrey';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const circles = CIRCLES_PROTOTYPE.map(circlePrototype => ({
    x: circlePrototype.x * SCALE,
    y: circlePrototype.y * SCALE,
    r: circlePrototype.r * SCALE,
}));

for (let i = 0; i < canvas.height; i++) {
    for (let j = 0; j < canvas.width; j++) {
        let score = circles.reduce((score, circle) => {
            return score + ((circle.r ** 2) /
                ((circle.x - j) ** 2 + (circle.y - i) ** 2));
        }, 0);
        //score = Math.min(score, 1);

        const hex = Math.floor(Math.min(score, 1) * 255).toString(16);
        ctx.fillStyle = '#' + hex.repeat(3);
        ctx.fillRect(j, i, 1, 1);

        if (score > 0.6) {
            ctx.fillStyle = 'lightblue';
            if (score > 1.2) ctx.fillStyle = 'blue';
            ctx.fillRect(j, i, 1, 1);
        }
    }
}

ctx.strokeStyle = 'white';
circles.forEach((circle) => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, TAU);
    ctx.stroke();
});
