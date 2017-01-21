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
    const timeStart = Date.now();
    const samples = SAMPLING ** 2;
    const spacing = 1 / SAMPLING;
    const start = spacing / 2;
    const averagingBuffer = [[], [], []];
    for (let i = 0; i < el.canvas.height; i++) {
        for (let j = 0; j < el.canvas.width; j++) {
            averagingBuffer[0] = averagingBuffer[1] = averagingBuffer[2] = 0;
            let x = start;
            let y = start;
            for (let c = 0; c < samples; c++) {
                const score = uiCircles.reduce((score, circle) => {
                    return score + ((circle.r ** 1.2) /
                        ((circle.x - j - x) ** 2 + (circle.y - i - y) ** 2));
                }, 0);

                const index = Math.min(10, Math.floor(
                    //(score * 1.3 - 3) * 2 - 2
                    score * 100
                ));
                averagingBuffer[0] += grades[index][0];
                averagingBuffer[1] += grades[index][1];
                averagingBuffer[2] += grades[index][2];

                x += spacing;
                if (x > 1) {
                    x -= 1;
                    y += spacing;
                }
            }

            const average = [
                Math.round(averagingBuffer[0] / samples),
                Math.round(averagingBuffer[1] / samples),
                Math.round(averagingBuffer[2] / samples),
            ];
            ctx.fillStyle = `rgb(${average[0]},${average[1]},${average[2]})`;
            ctx.fillRect(j, i, 1, 1);
        }
    }
    const timeEnd = Date.now();
    const timeSeconds2DP = Math.round((timeEnd - timeStart) / 10) / 100;
    console.log(`Completed in ${timeSeconds2DP} seconds.`);
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

const grades = [
    [   0,   0,   0 ],
    [   0,  10, 255 ],
    [ 255, 255, 255 ],
    [   0,   0,   0 ],
    [ 255,  20, 255 ],
    [ 255, 255, 255 ],
    [   0,   0,   0 ],
    [ 255,  10,   0 ],
    [ 255, 255, 255 ],
    [   0,   0,   0 ],
    [ 255, 255,  10 ],
];

/*
'black', 'darkblue', 'blue', 'dodgerblue', 'cyan', 'limegreen', 'yellowgreen',
'yellow', 'orange', 'red', 'maroon',
*/

draw();
