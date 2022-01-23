class PillPreviewElement {
    constructor(x, y, direction, color1, color2, parent) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.color = [color1, color2];
        /**
         * @type {PillPreview}
         */
        this.parent = parent;
    }

    Rotate() {
        if (this.direction == DIRECTION.HORIZONTAL) {
            this.direction = DIRECTION.VERTICAL;

            this.parent.array[this.y][this.x + 1] = 0;
            this.parent.array[this.y - 1][this.x] = this;
        } else {
            this.direction = DIRECTION.HORIZONTAL;
            this.color = [this.color[1], this.color[0]];

            this.parent.array[this.y - 1][this.x] = 0;
            this.parent.array[this.y][this.x + 1] = this;
        }
    }

    Move(direction) {
        let [dx, dy] = Util.ResolveMoveDirection(direction);

        if (this.direction == DIRECTION.HORIZONTAL) {
            this.parent.array[this.y][this.x] = 0;
            this.parent.array[this.y][this.x + 1] = 0;

            this.x += dx;
            this.y += dy;

            this.parent.array[this.y][this.x] = this;
            this.parent.array[this.y][this.x + 1] = this;
        } else {
            this.parent.array[this.y][this.x] = 0;
            this.parent.array[this.y - 1][this.x] = 0;

            this.x += dx;
            this.y += dy;

            this.parent.array[this.y][this.x] = this;
            this.parent.array[this.y - 1][this.x] = this;
        }
    }
}