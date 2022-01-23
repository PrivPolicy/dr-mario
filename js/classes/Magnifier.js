class Magnifier {
    constructor(DOMHandle, cell) {
        //this.positions = [[0, 3], [0, 4], [1, 5], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 5], [6, 4], [6, 3], [6, 2], [5, 1], [4, 1], [3, 1], [2, 1], [1, 2], [0, 3]];
        this.positions = [[1, 4], [1, 5], [2, 6], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 6], [7, 5], [7, 4], [7, 3], [6, 2], [5, 2], [4, 2], [3, 2], [2, 3], [1, 4]];

        this.startPosition = {
            red: 0,
            blue: 6,
            yellow: 12
        }

        this.currentPosition = { ...this.startPosition }

        this.frame = {
            neutral: 0
        }

        this.DOMMagnifier = DOMHandle;

        this.red = null;
        this.blue = null;
        this.yellow = null;

        this.cell = cell;

        this.frameDelay = 250;
        this.dyingFrames = 10;
        this.moveFrames = 4;

        this.image = {
            neutral: ["base", "right", "base", "left"],
            dying: ["dying.left", "dying.right"],
            laugh: ["laugh", "base"]
        }

        this.interval = null;
    }

    Initialize() {
        let DOMRed = document.createElement("img");
        let DOMBlue = document.createElement("img");
        let DOMYellow = document.createElement("img");

        this.DOMMagnifier.appendChild(DOMRed);
        this.DOMMagnifier.appendChild(DOMBlue);
        this.DOMMagnifier.appendChild(DOMYellow);

        [DOMRed, DOMBlue, DOMYellow].forEach(element => {
            element.classList.add("virus");
        });

        this.red = new MagnifierVirus(...this.positions[this.startPosition.red], this.cell, "magnifier.red.", this.image, DOMRed);
        this.blue = new MagnifierVirus(...this.positions[this.startPosition.blue], this.cell, "magnifier.blue.", this.image, DOMBlue);
        this.yellow = new MagnifierVirus(...this.positions[this.startPosition.yellow], this.cell, "magnifier.yellow.", this.image, DOMYellow);

        this.interval = setInterval(() => {
            this.NextFrame();
        }, this.frameDelay);
    }

    NextFrame() {
        if (++this.frame.neutral % this.moveFrames == 0) {
            this.MoveAround();
        }

        this.red.NextFrame(this.frame.neutral);
        this.blue.NextFrame(this.frame.neutral);
        this.yellow.NextFrame(this.frame.neutral);
    }

    SetState(color, state, duration = -1, nextState = MAGNIFIERVIRUSSTATE.NEUTRAL) {
        switch (color) {
            case MAGNIFIER.RED: {
                this.red.SetState(state, duration, nextState);
                break;
            }
            case MAGNIFIER.BLUE: {
                this.blue.SetState(state, duration, nextState);
                break;
            }
            case MAGNIFIER.YELLOW: {
                this.yellow.SetState(state, duration, nextState);
                break;
            }
        }
    }

    MoveAround() {
        if ([this.red.state, this.blue.state, this.yellow.state].includes(MAGNIFIERVIRUSSTATE.LAUGH) ||
            [this.red.state, this.blue.state, this.yellow.state].includes(MAGNIFIERVIRUSSTATE.DYING)) {
            return;
        }

        this.currentPosition.red++;
        this.currentPosition.blue++;
        this.currentPosition.yellow++;

        this.red.Move(...this.positions[this.currentPosition.red % this.positions.length])
        this.blue.Move(...this.positions[this.currentPosition.blue % this.positions.length])
        this.yellow.Move(...this.positions[this.currentPosition.yellow % this.positions.length])
    }

    Restart() {
        clearInterval(this.interval)

        this.currentPosition = { ...this.startPosition };

        this.frame.neutral = 0;

        this.red = new MagnifierVirus(...this.positions[this.startPosition.red], this.cell, "magnifier.red.", this.image, this.red.DOMHandle);
        this.blue = new MagnifierVirus(...this.positions[this.startPosition.blue], this.cell, "magnifier.blue.", this.image, this.blue.DOMHandle);
        this.yellow = new MagnifierVirus(...this.positions[this.startPosition.yellow], this.cell, "magnifier.yellow.", this.image, this.yellow.DOMHandle);

        this.interval = setInterval(() => {
            this.NextFrame();
        }, this.frameDelay);
    }

    Laugh() {
        if (this.red.state != MAGNIFIERVIRUSSTATE.KILLED) {
            this.SetState(MAGNIFIER.RED, MAGNIFIERVIRUSSTATE.LAUGH);
        }
        if (this.blue.state != MAGNIFIERVIRUSSTATE.KILLED) {
            this.SetState(MAGNIFIER.BLUE, MAGNIFIERVIRUSSTATE.LAUGH);
        }
        if (this.yellow.state != MAGNIFIERVIRUSSTATE.KILLED) {
            this.SetState(MAGNIFIER.YELLOW, MAGNIFIERVIRUSSTATE.LAUGH);
        }
    }
}