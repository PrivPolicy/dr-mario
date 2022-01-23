class Pill {
    /**
     * @param {Number} id
     * @param {Number} x
     * @param {Number} y
     * @param {String} color1
     * @param {String} [color2]
     */
    constructor(id, x, y, color1, color2) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = DIRECTION.HORIZONTAL;
        this.state = PILLSTATE.FALLING;
        this.color = [color1, color2];
    }

    get length() { return this.color.length; }

    SwapColors() {
        [this.color[0], this.color[1]] = [this.color[1], this.color[0]];
    }

    SwapDirection() {
        if (this.direction == DIRECTION.HORIZONTAL) { this.direction = DIRECTION.VERTICAL; }
        else { this.direction = DIRECTION.HORIZONTAL; }
    }
}