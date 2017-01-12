// CONSTANTS

const SCALE = 3;
const CIRCLES_PROTOTYPE = [
    { x: 18,  y: 12, r: 7  },
    { x: 40,  y: 70, r: 14 },
    { x: 50,  y: 26, r: 8  },
    { x: 50,  y: 26, r: 8  },
    { x: 68,  y: 66, r: 4  },
    { x: 68,  y: 66, r: 4  },
    { x: 120, y: 40, r: 26 },
];

const TAU = 2 * Math.PI;

// GLOBALS
const el = {};
el.artboardInterface = document.querySelector('.artboard__interface');

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
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const circles = CIRCLES_PROTOTYPE.map(circlePrototype => ({
    x: circlePrototype.x * SCALE,
    y: circlePrototype.y * SCALE,
    r: circlePrototype.r * SCALE,
}));

const grades = [
    'rgba(0,10,250,0)',
    'rgba(0,10,250,0.1)',
    'rgba(0,10,250,0.2)',
    'rgba(0,10,250,0.3)',
    'rgba(0,10,250,0.4)',
    'rgba(0,10,250,0.5)',
    'rgba(0,10,250,0.6)',
    'rgba(0,10,250,0.7)',
    'rgba(0,10,250,0.8)',
    'rgba(0,10,250,0.9)',
    'rgba(0,10,250,1)',
]

for (let i = 0; i < canvas.height; i++) {
    for (let j = 0; j < canvas.width; j++) {
        let score = circles.reduce((score, circle) => {
            return score + ((circle.r ** 1.2) /
                ((circle.x - j) ** 2 + (circle.y - i) ** 2));
        }, 0);

        const index = Math.min(10, Math.floor(
            //(score * 1.3 - 3) * 2 - 2
            score * 100
        ));
        if (index > 0) {
            ctx.fillStyle = grades[index];
            ctx.fillRect(j, i, 1, 1);
        }
    }
}

/*
ctx.strokeStyle = 'white';
circles.forEach((circle) => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, TAU);
    ctx.stroke();
});
*/

circles.forEach((circle) => {
    const elCircle = document.createElement('div');
    const diameterPx = `${circle.r * 2}px`;
    elCircle.style.width = diameterPx;
    elCircle.style.height = diameterPx;
    elCircle.style.top = `${circle.y - circle.r}px`;
    elCircle.style.left = `${circle.x - circle.r}px`;
    elCircle.classList.add('artboard__circle');
    el.artboardInterface.appendChild(elCircle);
});
