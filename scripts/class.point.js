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
