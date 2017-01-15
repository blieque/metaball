// CONSTANTS

const TAU = 2 * Math.PI;

// GLOBALS

const el = {};
el.artboard = document.querySelector('.artboard');
el.artboardInterface = document.querySelector('.artboard__interface');
el.canvas = document.querySelector('canvas');

let currentArtboardScale = 1;
const uiCircles = [];

// FUNCTIONS

const scaleCanvasToViewport = function scaleCanvasToViewport() {
    let ratioWidth = (window.innerWidth - 16) / el.canvas.width;
    let ratioHeight = (window.innerHeight - 16) / el.canvas.height;
    let ratioMin = Math.floor(Math.min(ratioWidth, ratioHeight));
    ratioMin = Math.max(1, ratioMin);
    currentArtboardScale = ratioMin;
    el.artboard.style.transform = `scale(${ratioMin})`;
};
window.addEventListener('resize', scaleCanvasToViewport);

const draw = function draw() {
    for (let i = 0; i < el.canvas.height; i++) {
        for (let j = 0; j < el.canvas.width; j++) {
            let score = uiCircles.reduce((score, circle) => {
                return score + ((circle.r ** 1.2) /
                    ((circle.x - j) ** 2 + (circle.y - i) ** 2));
            }, 0);

            const index = Math.min(10, Math.floor(
                //(score * 1.3 - 3) * 2 - 2
                score * 100
            ));

            //if (index > 0) {
            //}
            ctx.fillStyle = grades[index];
            ctx.fillRect(j, i, 1, 1);
        }
    }
}

// RUNTIME

el.canvas.width = SCALE * 160;
el.canvas.height = SCALE * 90;
scaleCanvasToViewport();

const ctx = el.canvas.getContext('2d');
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, el.canvas.width, el.canvas.height);

const circles = CIRCLES_PROTOTYPE.map(circlePrototype => ({
    x: circlePrototype.x * SCALE,
    y: circlePrototype.y * SCALE,
    r: circlePrototype.r * SCALE,
}));

uiCircles.push(...CIRCLES_PROTOTYPE.map(circlePrototype =>
    new Circle(
        circlePrototype.x * SCALE,
        circlePrototype.y * SCALE,
        circlePrototype.r * SCALE,
        el.artboardInterface)
));

/*
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
*/

const grades = [
    'black',
    'darkblue',
    'blue',
    'dodgerblue',
    'cyan',
    'limegreen',
    'yellowgreen',
    'yellow',
    'orange',
    'red',
    'maroon',
]

draw();
