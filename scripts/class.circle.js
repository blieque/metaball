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
        this.r = Math.min(100, Math.max(10, this.r));
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
