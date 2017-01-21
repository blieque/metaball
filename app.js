// metaball experiment configuration

const SCALE = 3;
const SAMPLING = 2;
const CIRCLES_PROTOTYPE = [
    { x: 18,  y: 12, r: 7  },
    { x: 40,  y: 70, r: 14 },
    { x: 50,  y: 26, r: 8  },
    { x: 50,  y: 26, r: 8  },
    { x: 68,  y: 66, r: 4  },
    { x: 68,  y: 66, r: 4  },
    { x: 120, y: 40, r: 26 },
];

const reducerSum = function reducerSum(acc, a) {
    return acc + a;
};

class Point {

    distanceTo(x, y) {
        if (x instanceof Point) {
            y = x.y;
            x = x.x;
        }
        const deltaX = this.x - x;
        const deltaY = this.y - y;
        return Math.sqrt(deltaX ** 2 + deltaY ** 2);
    }

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}

class Circle extends Point {

    _addHandlers(elControl, mouseMoveHandler) {
        const mouseUpHandler = (event) => {
            document.querySelector('.circle__control--hover')
                .classList.remove('circle__control--hover');
            draw();
            window.removeEventListener('mousemove', mouseMoveHandler);
            window.removeEventListener('mouseup', mouseUpHandler);
        };
        elControl.addEventListener('mousedown', (event) => {
            event.currentTarget.classList.add('circle__control--hover');
            const scaledX = event.clientX / currentArtboardScale;
            const scaledY = event.clientY / currentArtboardScale;
            this._dragStart = {
                x: event.clientX,
                y: event.clientY,
                deltaX: scaledX - this.x,
                deltaY: scaledY - this.y,
                distance: this.distanceTo(scaledX, scaledY),
                originalR: this.r / currentArtboardScale,
            };
            event.preventDefault();
            window.addEventListener('mousemove', mouseMoveHandler);
            window.addEventListener('mouseup', mouseUpHandler);
        });
    }

    _resizeHandler(event) {
        event.preventDefault();

        const distance = this.distanceTo(
            event.clientX / currentArtboardScale,
            event.clientY / currentArtboardScale);
        const scale = distance / this._dragStart.distance
        this.r = currentArtboardScale * this._dragStart.originalR * scale;
        this._updatePosition();
    }

    _moveHandler(event) {
        event.preventDefault();
        this.x = event.clientX / currentArtboardScale - this._dragStart.deltaX;
        this.y = event.clientY / currentArtboardScale - this._dragStart.deltaY;
        this._updatePosition();
    }

    _updatePosition() {
        this.r = Math.min(256, Math.max(8, this.r));
        const diameterPx = `${this.r * 2}px`;
        this._el.circle.style.width = diameterPx;
        this._el.circle.style.height = diameterPx;
        this._el.circle.style.top = `${this.y}px`;
        this._el.circle.style.left = `${this.x}px`;
    }

    constructor(x, y, r, elParent) {
        super(x, y);
        this.r = r;

        // screw javascript
        this._resizeHandlerBound = this._resizeHandler.bind(this);
        this._moveHandlerBound = this._moveHandler.bind(this);

        this._el = {};
        this._el.circle = document.createElement('div');

        const diameterPx = `${r * 2}px`;
        this._el.circle.style.width = diameterPx;
        this._el.circle.style.height = diameterPx;
        this._el.circle.style.top = `${y}px`;
        this._el.circle.style.left = `${x}px`;
        this._el.circle.classList.add('circle');

        this._el.resize = document.createElement('div');
        this._el.resize.classList.add('circle__resize');
        this._el.circle.appendChild(this._el.resize);

        this._el.move = document.createElement('div');
        this._el.move.classList.add('circle__move');
        this._el.circle.appendChild(this._el.move);

        this._addHandlers(this._el.resize, this._resizeHandler.bind(this));
        this._addHandlers(this._el.move, this._moveHandler.bind(this));

        if (elParent instanceof HTMLElement) {
            elParent.appendChild(this._el.circle);
        }
    }

}

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

//# sourceMappingURL=app.js.map
