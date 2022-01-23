class PillPreview {
    constructor(DOMHandle, DOMHandleMario, parent) {
        this.DOMHandle = DOMHandle;
        /**
         * @type {HTMLImageElement}
         */
        this.DOMHandleMario = DOMHandleMario;
        this.parent = parent;
        DOMHandle.appendChild(DOMHandleMario);
        this.DOMHandleMario.src = gr.Get('mario.throw.1');

        this.pillPreview = null;

        this.array = Util.GenerateArray(12, 6, 0);

        /**
         * @type {HTMLDivElement[][]}
         */
        this.DOMArray = [];

        this.startX = 10;
        this.startY = 3;

        for (let y = 0; y < 6; y++) {
            this.DOMArray.push([]);

            for (let x = 0; x < 12; x++) {
                let p = document.createElement("div");
                p.classList.add("element");
                this.DOMHandle.appendChild(p);

                this.DOMArray[y].push(p);
            }
        }

        this.animationFrameCounter = 0;
        this.animationFrames = pillPreviewAnimationFrames;
        this.animationInterval = null;

        this.NewPill();
    }

    NewPill() {
        this.pillPreview = new PillPreviewElement(this.startX, this.startY, DIRECTION.HORIZONTAL, ...Util.GetRandomColor(2), this);
        this.array[this.startY][this.startX] = this.pillPreview;
        this.array[this.startY][this.startX + 1] = this.pillPreview;

        this.DOMHandleMario.src = gr.Get('mario.throw.1');

        this.Draw();
    }

    Draw() {
        for (let y = 0; y < this.array.length; y++) {
            for (let x = 0; x < this.array[0].length; x++) {
                let v = this.array[y][x];

                if (v instanceof PillPreviewElement) {
                    if (v.x == x && v.y == y) {
                        if (v.direction == DIRECTION.HORIZONTAL) {
                            this.DOMArray[y][x].style.backgroundImage = `url("${gr.Get(`pill.${v.color[0].toLowerCase()}.left`)}")`;
                        } else {
                            this.DOMArray[y][x].style.backgroundImage = `url("${gr.Get(`pill.${v.color[0].toLowerCase()}.down`)}")`;
                        }
                    } else {
                        if (v.direction == DIRECTION.HORIZONTAL) {
                            this.DOMArray[y][x].style.backgroundImage = `url("${gr.Get(`pill.${v.color[1].toLowerCase()}.right`)}")`;
                        } else {
                            this.DOMArray[y][x].style.backgroundImage = `url("${gr.Get(`pill.${v.color[1].toLowerCase()}.up`)}")`;
                        }
                    }
                } else {
                    this.DOMArray[y][x].style.backgroundImage = "";
                }
            }
        }
    }

    OnAnimationEnd() {
        this.array[this.pillPreview.y][this.pillPreview.x] = 0;
        this.array[this.pillPreview.y][this.pillPreview.x + 1] = 0;

        this.DOMHandleMario.src = gr.Get('mario.throw.1');

        this.animationFrameCounter = -1;
        clearInterval(this.animationInterval);

        this.parent.GenerateNextPill(this.pillPreview.color[0], this.pillPreview.color[1]);

        this.NewPill();
    }

    StartAnimation() {
        this.animationInterval = setInterval(() => {
            if (this.animationFrameCounter < this.animationFrames.length) {
                this.animationFrames[this.animationFrameCounter].forEach(element => {
                    this.Resolve(element);
                });
                this.Draw();
                this.animationFrameCounter++;
            }
        }, SETTINGS.pillPreviewAnimationDelay);
    }

    Resolve(command) {
        switch (command) {
            case "r": {
                this.pillPreview.Rotate();
                break;
            }
            case "mu": {
                this.pillPreview.Move(MOVE.UP);
                break;
            }
            case "ml": {
                this.pillPreview.Move(MOVE.LEFT);
                break;
            }
            case "md": {
                this.pillPreview.Move(MOVE.DOWN);
                break;
            }
            case "t1": {
                this.DOMHandleMario.src = gr.Get("mario.throw.1");
                break;
            }
            case "t2": {
                this.DOMHandleMario.src = gr.Get("mario.throw.2");
                break;
            }
            case "t3": {
                this.DOMHandleMario.src = gr.Get("mario.throw.3");
                break;
            }
            case "h": {
                this.OnAnimationEnd();
                break;
            }
        }
    }

    Clear() {
        for (let y = 0; y < this.array.length; y++) {
            for (let x = 0; x < this.array[0].length; x++) {
                this.array[y][x] = 0;
            }
        }

        this.Draw();
    }
}