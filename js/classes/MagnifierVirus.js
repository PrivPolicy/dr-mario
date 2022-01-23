class MagnifierVirus {
    constructor(x, y, cell, imageString, imageRef, DOMHandle) {
        this.x = x;
        this.y = y;
        this.cell = cell;
        this.imageString = imageString;
        this.imageRef = imageRef;
        this.DOMHandle = DOMHandle;

        this.frame = 0;

        this.state = MAGNIFIERVIRUSSTATE.NEUTRAL;
        this.nextState = MAGNIFIERVIRUSSTATE.NEUTRAL;
        this.stateDuration = -1;

        this.Move();

        this.DOMHandle.src = gr.Get(`${imageString}base`);
        this.DOMHandle.style.display = "block";
    }

    Move(x = this.x, y = this.y) {
        this.x = x;
        this.y = y;

        this.DOMHandle.style.left = `${x * this.cell}px`;
        this.DOMHandle.style.top = `${y * this.cell}px`;
    }

    NextFrame(frame) {
        this.frame = frame;

        if (this.state != MAGNIFIERVIRUSSTATE.KILLED) {
            if (this.stateDuration == 0) {
                this.SetState(this.nextState);
            } else if (this.stateDuration != -1) {
                this.stateDuration--;
            }

            this.SetImage();
        }
    }

    SetState(state, duration = -1, nextStage = MAGNIFIERVIRUSSTATE.NEUTRAL) {
        this.state = state;
        this.nextState = nextStage;
        this.stateDuration = duration;

        if (state == MAGNIFIERVIRUSSTATE.KILLED) {
            this.DOMHandle.style.display = "none";
        } else {
            this.DOMHandle.style.display = "block";
        }
    }

    SetImage() {
        if (this.state != MAGNIFIERVIRUSSTATE.KILLED) {
            let modulo = this.state == MAGNIFIERVIRUSSTATE.NEUTRAL ? 4 : 2

            this.DOMHandle.src = gr.Get(`${this.imageString}${this.imageRef[this.state.toLowerCase()][this.frame % modulo]}`);
        }
    }
}