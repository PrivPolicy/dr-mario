"use strict"

class Game {
    /**
     * @param {HTMLDivElement} DOMHandle
     * @param {Number} w
     * @param {Number} h
     */
    constructor(DOMHandle, w, h) {
        this.DOMHandle = DOMHandle;

        let a = document.createElement("div");
        a.id = "ambient";
        let b = document.createElement("div");
        b.id = "background";
        let bt = document.createElement("div");
        bt.id = "bottle";

        this.DOMAmbient = {
            DOMHandle: a,
            SetColor: function (color) { this.DOMHandle.style["backgroundColor"] = color; }
        };
        this.DOMBackground = b;
        this.DOMBottle = bt;

        this.tileList = [];

        this.DOMHandle.appendChild(this.DOMAmbient.DOMHandle);
        this.DOMHandle.appendChild(this.DOMBackground);
        this.DOMHandle.appendChild(this.DOMBottle);

        this.board = Util.GenerateArray(w, h, SETTINGS.defaultBottleValue);

        // "shaping" the bottle
        this.board[0][0] = 1;
        this.board[0][1] = 1;
        this.board[0][2] = 1;
        this.board[0][5] = 1;
        this.board[0][6] = 1;
        this.board[0][7] = 1;

        for (let i = 0; i < w * h; i++) {
            let d = document.createElement("div");
            d.classList.add("tile");

            this.tileList.push(d);
            this.DOMBottle.appendChild(d);
        }

        this.pills = {};
        this.currentPillID = 0;

        this.task = {
            pillGravity: null
        }

        this.inputManager = null;

        this.canMove = [false];

        this.DOMCounter = {
            topScore: null,
            currentScore: null,
            level: null,
            virus: null
        }

        this.virus = {
            red: 0,
            blue: 0,
            yellow: 0
        }

        this.CreateCounters();

        this.counter = {
            topScore: new Counter(this.DOMCounter.topScore, 7),
            currentScore: new Counter(this.DOMCounter.currentScore, 7),
            level: new Counter(this.DOMCounter.level, 2),
            virus: new Counter(this.DOMCounter.virus, 2)
        }

        this.scoreToAdd = 0;

        this.DOMOverlay = document.createElement("div");
        this.DOMOverlay.id = "win-lose-overlay";
        this.DOMHandle.appendChild(this.DOMOverlay);

        this.overlay = new WinLoseOverlay(this.DOMOverlay);

        this.complete = false;

        this.DOMMagnifier = document.createElement("div");
        this.DOMMagnifier.id = "magnifier";
        this.DOMHandle.appendChild(this.DOMMagnifier);

        this.magnifier = new Magnifier(this.DOMMagnifier, 24);
        this.magnifier.Initialize();

        let pp = document.createElement("div");
        let ppm = document.createElement("img");
        pp.id = "pill-preview";
        ppm.id = "mario";
        this.DOMHandle.appendChild(pp);
        this.pillPreview = new PillPreview(pp, ppm, this);
    }

    CreateCounters() {
        this.DOMCounter.topScore = document.createElement("div");
        this.DOMCounter.currentScore = document.createElement("div");
        this.DOMCounter.level = document.createElement("div");
        this.DOMCounter.virus = document.createElement("div");

        this.DOMCounter.topScore.classList.add("counter");
        this.DOMCounter.currentScore.classList.add("counter");
        this.DOMCounter.level.classList.add("counter");
        this.DOMCounter.virus.classList.add("counter");

        this.DOMCounter.topScore.style.top = "120px";
        this.DOMCounter.topScore.style.left = "120px";

        this.DOMCounter.currentScore.style.top = "192px";
        this.DOMCounter.currentScore.style.left = "120px";

        this.DOMCounter.level.style.top = "360px";
        this.DOMCounter.level.style.left = "840px";

        this.DOMCounter.virus.style.top = "504px";
        this.DOMCounter.virus.style.left = "840px";

        this.DOMHandle.appendChild(this.DOMCounter.topScore);
        this.DOMHandle.appendChild(this.DOMCounter.currentScore);
        this.DOMHandle.appendChild(this.DOMCounter.level);
        this.DOMHandle.appendChild(this.DOMCounter.virus);
    }

    /**
     * @type {Pill}
     */
    get currentPill() { return this.pills[this.currentPillID]; }

    NextPill() {
        this.canMove[0] = false;

        if (this.FourInARow()) {
            setTimeout(() => {
                this.BoardGravity();
            }, 2 * SETTINGS.pillPopTime)
            return;
        }

        if (this.CheckIfLost()) {
            this.OnLose();
            return;
        }

        if (this.scoreToAdd != 0) {
            this.counter.currentScore.Increment(this.scoreToAdd);
            this.counter.virus.Decrement(this.scoreToAdd / SETTINGS.virusScore);

            this.scoreToAdd = 0;
        }

        if (this.CheckIfWon()) {
            this.OnWin();
            return;
        }

        setTimeout(() => {
            this.pillPreview.StartAnimation();
        }, SETTINGS.nextPillDelay);
    }

    GenerateNextPill(color1, color2) {
        // @ts-ignore
        this.canMove[0] = true;

        let p = new Pill(++this.currentPillID, SETTINGS.bottleStartX, SETTINGS.bottleStartY, color1, color2);

        this.pills[this.currentPillID] = p;

        this.board[SETTINGS.bottleStartY][SETTINGS.bottleStartX] = p;
        this.board[SETTINGS.bottleStartY][SETTINGS.bottleStartX + 1] = p;

        this.DrawBoard();
        this.ApplyGravity(true);
    }

    DrawBoard() {
        this.tileList.forEach((element, i) => {
            let v = this.board[(i - (i % SETTINGS.bottleWidth)) / SETTINGS.bottleWidth][i % SETTINGS.bottleWidth];

            element.style.backgroundImage = "";

            if (v == null) { return; }

            let c;
            let d;

            if (v instanceof Pill) {
                if (v.y * SETTINGS.bottleWidth + v.x == i) {
                    if (v.length == 2) {
                        c = v.color[0].toLowerCase();

                        if (v.direction == DIRECTION.HORIZONTAL) {
                            d = MOVE.LEFT;
                        } else {
                            d = MOVE.DOWN;
                        }
                    } else {
                        c = v.color[0].toLowerCase();
                        d = "single";
                    }
                } else {
                    if (v.length == 2) {
                        c = v.color[1].toLowerCase();

                        if (v.direction == DIRECTION.HORIZONTAL) {
                            d = MOVE.RIGHT;
                        } else {
                            d = MOVE.UP;
                        }
                    } else {
                        c = v.color[0].toLowerCase();
                        d = "single";
                    }
                }

                d = d.toLowerCase();

                element.style.backgroundImage = `url('${gr.Get(`pill.${c}.${d}`)}')`;
            } else if (v instanceof Virus) {
                if (element.style.backgroundImage == "") {
                    element.style.backgroundImage = `url(${gr.Get(`virus.${v.color.toLowerCase()}.alive`)})`;
                }
            }
        });
    }

    MovePillCheck(dir, returnValue = false, p = this.currentPill, gravity = false) {
        if (this.complete == true) {
            return;
        }

        if (p.state != PILLSTATE.FALLING && !(p.state == PILLSTATE.LOCKED && dir == MOVE.DOWN) && !gravity) {
            return;
        }

        let m = Util.ResolveMoveDirection(dir);

        let dx = p.x + m[0];
        let dy = p.y + m[1];

        if (dy >= SETTINGS.bottleHeight && !returnValue) {
            this.MovePill(0, 0, true);
        }

        if (!(dx >= 0 && dy >= 0 && dx < SETTINGS.bottleWidth && dy < SETTINGS.bottleHeight) && !returnValue) {
            return;
        } else if (!(dx >= 0 && dy >= 0 && dx < SETTINGS.bottleWidth && dy < SETTINGS.bottleHeight)) {
            return { move: false, settled: false };
        }

        let move = false;
        let settled = false;

        if (p.direction == DIRECTION.HORIZONTAL) {
            if (dir == MOVE.DOWN) {
                if ((this.board[dy][dx] == SETTINGS.defaultBottleValue && this.board[dy][dx + 1] == SETTINGS.defaultBottleValue) || (this.board[dy][dx] == SETTINGS.defaultBottleValue && p.length == 1)) {
                    move = true;
                } else {
                    settled = true;
                }
            } else if (dir == MOVE.LEFT) {
                if (this.board[dy][dx] == SETTINGS.defaultBottleValue) {
                    move = true;
                }
            } else if (dir == MOVE.RIGHT) {
                if (this.board[dy][dx + 1] == SETTINGS.defaultBottleValue && dx != SETTINGS.bottleWidth - 1) {
                    move = true;
                }
            }
        } else if (p.direction == DIRECTION.VERTICAL) {
            if (dir == MOVE.DOWN) {
                if (this.board[dy][dx] == SETTINGS.defaultBottleValue) {
                    move = true;
                } else {
                    settled = true;
                }
            } else if (dir == MOVE.LEFT) {
                if (this.board[dy][dx] == SETTINGS.defaultBottleValue && this.board[dy - 1][dx] == SETTINGS.defaultBottleValue) {
                    move = true;
                }
            } else if (dir == MOVE.RIGHT) {
                if (this.board[dy][dx] == SETTINGS.defaultBottleValue && this.board[dy - 1][dx] == SETTINGS.defaultBottleValue) {
                    move = true;
                }
            }
        }

        if (returnValue) {
            return { move: move, settled: settled };
        } else if (move || settled) {
            this.MovePill(dx, dy, settled);
        }
    }

    MovePill(x, y, settled = false, p = this.currentPill, draw = true) {
        if (this.complete == true) {
            return;
        }

        if (settled) {
            p.state = PILLSTATE.SETTLED;
            this.ApplyGravity(false);
            this.NextPill();

            return;
        }

        let ox = p.x;
        let oy = p.y;

        if (p.length == 2) {
            if (p.direction == DIRECTION.HORIZONTAL) {
                this.board[oy][ox] = SETTINGS.defaultBottleValue;
                this.board[oy][ox + 1] = SETTINGS.defaultBottleValue;
                this.board[y][x] = p;
                this.board[y][x + 1] = p;
            } else if (p.direction == DIRECTION.VERTICAL) {
                this.board[oy][ox] = SETTINGS.defaultBottleValue;
                this.board[oy - 1][ox] = SETTINGS.defaultBottleValue;
                this.board[y][x] = p;
                this.board[y - 1][x] = p;
            } else {
                return;
            }
        } else if (p.length == 1) {
            this.board[oy][ox] = SETTINGS.defaultBottleValue;
            this.board[y][x] = p;
        }

        p.x = x;
        p.y = y;

        if (draw) {
            this.DrawBoard();
        }
    }

    RotatePillCheck(dir, returnValue = false) {
        if (this.complete == true) {
            return;
        }

        let p = this.currentPill;

        if (p.state != PILLSTATE.FALLING) {
            return;
        }

        if (p.length == 1) { // only 1 color, so why rotate?
            return;
        }

        if (dir != MOVE.LEFT && dir != MOVE.RIGHT) {
            return;
        }

        let d = p.direction;

        let rotate = false;
        let moveLeft = false;

        if (d == DIRECTION.HORIZONTAL) {
            if (!(p.x >= 0 && p.y - 1 >= 0 && p.x < SETTINGS.bottleWidth && p.y - 1 < SETTINGS.bottleHeight)) { return; }

            if (this.board[p.y - 1][p.x] == SETTINGS.defaultBottleValue) {
                rotate = true;
            }
        } else if (d == DIRECTION.VERTICAL) {
            if (p.x == SETTINGS.bottleWidth - 1) {
                if (this.board[p.y][p.x - 1] == SETTINGS.defaultBottleValue) {
                    rotate = true;
                    moveLeft = true;
                }
            } else {
                if (this.board[p.y][p.x + 1] == SETTINGS.defaultBottleValue) {
                    rotate = true;
                }
            }
        }

        if (returnValue) {
            return { rotate: rotate, moveLeft: moveLeft };
        } else if (rotate) {
            this.RotatePill(dir);

            if (moveLeft) {
                this.MovePill(p.x - 1, p.y);
            }
        }
    }

    RotatePill(dir) {
        if (this.complete == true) {
            return;
        }

        let p = this.currentPill;

        let d = p.direction;

        if (dir == MOVE.LEFT) {
            if (d == DIRECTION.VERTICAL) {
                p.SwapColors();

                this.board[p.y - 1][p.x] = SETTINGS.defaultBottleValue;
                this.board[p.y][p.x + 1] = p;
            } else {
                this.board[p.y][p.x + 1] = SETTINGS.defaultBottleValue;
                this.board[p.y - 1][p.x] = p;
            }

            p.SwapDirection();
        } else if (dir == MOVE.RIGHT) {
            if (d == DIRECTION.HORIZONTAL) {
                p.SwapColors();

                this.board[p.y][p.x + 1] = SETTINGS.defaultBottleValue;
                this.board[p.y - 1][p.x] = p;
            } else {
                this.board[p.y - 1][p.x] = SETTINGS.defaultBottleValue;
                this.board[p.y][p.x + 1] = p;
            }

            p.SwapDirection();
        } else {
            return;
        }

        this.DrawBoard();
    }

    CheckIfLost() {
        if (this.board[SETTINGS.bottleStartY][SETTINGS.bottleStartX] != SETTINGS.defaultBottleValue || this.board[SETTINGS.bottleStartY][SETTINGS.bottleStartX + 1] != SETTINGS.defaultBottleValue) {
            return true;
        }

        return false;
    }

    CheckIfWon() {
        if (this.counter.virus.value == 0) {
            return true;
        }

        return false;
    }

    ApplyGravity(bool = false, delay = undefined) {
        if (bool) {
            /**
             * @param {Game} t
             */
            function Gravity(t) {
                t.MovePillCheck(MOVE.DOWN);
            }

            if (this.task.pillGravity == null) {
                this.task.pillGravity = setInterval(Gravity, delay || SETTINGS.pillGravityDelay, this);
            }
        } else {
            clearInterval(this.task.pillGravity);
            this.task.pillGravity = null;
        }
    }

    RegisterInputManager() {
        this.inputManager = new InputManager(this.canMove);

        this.inputManager.Add("left", () => { this.MovePillCheck(MOVE.LEFT); }, ["KeyA", "ArrowLeft"], true, 150);
        this.inputManager.Add("right", () => { this.MovePillCheck(MOVE.RIGHT); }, ["KeyD", "ArrowRight"], true, 150);
        this.inputManager.Add("down", () => { this.ForceFall(); }, ["KeyS", "ArrowDown"], false);
        this.inputManager.Add("rotateLeft", () => { this.RotatePillCheck(MOVE.LEFT); }, ["KeyW", "ArrowUp"], true, 150);
        this.inputManager.Add("rotateRight", () => { this.RotatePillCheck(MOVE.RIGHT); }, ["ShiftLeft", "ShiftRight"], true, 150);
        this.inputManager.Add("nextStage", () => { this.NextStage(); }, ["ShiftLeft", "ShiftRight"], false);
        // this.inputManager.Add("rotateLeft", () => { this.RotatePill(MOVE.LEFT); }, ["KeyW", "ArrowUp"], false);
        // this.inputManager.Add("rotateRight", () => { this.RotatePill(MOVE.RIGHT); }, ["ShiftLeft", "ShiftRight"], false);

        this.inputManager.RegisterEventCapture();
    }

    ForceFall() {
        this.ApplyGravity(false);

        this.currentPill.state = PILLSTATE.LOCKED;

        this.ApplyGravity(true, SETTINGS.pillGravityDelayForced);
    }

    FourInARow() {
        function m(x, n) {
            return (n % (x + 1) == x) ? null : n - Math.floor(n / (x + 1));
        }

        function v(element, x, y) {
            if (typeof (element) == "number") { return element; }
            else if (element instanceof Pill) {
                if (element.x == x && element.y == y) { return element.color[0].toUpperCase().substring(0, 1); }
                else { return element.color[1].toUpperCase().substring(0, 1); }
            }
            else if (element instanceof Virus) { return element.color.toLowerCase().substring(0, 1); }
        }

        let horizontalString = "";
        let verticalString = "";

        let re = /(r{4,}|b{4,}|y{4,})/gi;
        let found;

        let indices = [];

        for (let i = 0; i < SETTINGS.bottleWidth * SETTINGS.bottleHeight; i++) {
            let x = i % SETTINGS.bottleWidth;
            let y = (i - x) / SETTINGS.bottleWidth;

            horizontalString += v(this.board[y][x], x, y);

            x = i % SETTINGS.bottleHeight;
            y = (i - x) / SETTINGS.bottleHeight;

            verticalString += v(this.board[x][y], y, x);

            if ((i + 1) % SETTINGS.bottleWidth == 0) { horizontalString += "|"; }
            if ((i + 1) % SETTINGS.bottleHeight == 0) { verticalString += "|"; }
        }

        // Horizontal match
        while ((found = re.exec(horizontalString)) !== null) {
            if (found[0] == found[0].toLowerCase()) { continue; }

            let l = found[0].length;
            let i = m(SETTINGS.bottleWidth, found.index);

            let x = i % SETTINGS.bottleWidth;
            let y = (i - x) / SETTINGS.bottleWidth;

            for (let j = 0; j < l; j++) {
                indices.push([x + j, y]);
            }
        }

        // Vertical match
        while ((found = re.exec(verticalString)) !== null) {
            if (found[0] == found[0].toLowerCase()) { continue; }

            let l = found[0].length;
            let i = m(SETTINGS.bottleHeight, found.index);

            let x = i % SETTINGS.bottleHeight;
            let y = (i - x) / SETTINGS.bottleHeight;

            for (let j = 0; j < l; j++) {
                indices.push([y, x + j]);
            }
        }

        indices.forEach(element => {
            this.RemoveFromBoard(element[0], element[1]);
        });

        if (indices.length != 0) {
            return true;
        } else {
            return false;
        }
    }

    BoardGravity() {
        let anyFallen = false;

        for (let y = SETTINGS.bottleHeight - 1; y >= 0; y--) {
            for (let x = 0; x < SETTINGS.bottleWidth; x++) {
                let v = this.board[y][x];

                if (v instanceof Pill) {
                    if (this.MovePillCheck(MOVE.DOWN, true, v, true).move == true) {
                        anyFallen = true
                        this.MovePill(v.x, v.y + 1, false, v, false);
                    }
                }
            }
        }

        this.DrawBoard();

        if (anyFallen) {
            setTimeout(() => { this.BoardGravity() }, SETTINGS.boardGravityDelay);
        } else {
            this.NextPill();
        }
    }

    RemoveFromBoard(x, y) {
        let v = this.board[y][x];

        if (v instanceof Pill || v instanceof Virus) {
            this.PopElement(x, y);
        }

        if (v instanceof Pill) {
            if (v.length == 1) {
                this.board[y][x] = SETTINGS.defaultBottleValue;
            } else {
                if (v.x == x && v.y == y) {
                    v.color = v.color.splice(1, 1);

                    this.board[y][x] = SETTINGS.defaultBottleValue;

                    if (v.direction == DIRECTION.HORIZONTAL) {
                        v.x = x + 1;
                        v.y = y;
                    } else {
                        v.x = x;
                        v.y = y - 1;
                    }
                } else {
                    v.color = v.color.splice(0, 1);

                    this.board[y][x] = SETTINGS.defaultBottleValue;
                }
            }
        } else if (v instanceof Virus) {
            let nextState = null;

            if (--this.virus[v.color] == 0) {
                nextState = MAGNIFIERVIRUSSTATE.KILLED;
            } else {
                nextState = MAGNIFIERVIRUSSTATE.NEUTRAL;
            }

            this.magnifier.SetState(v.color.toUpperCase(), MAGNIFIERVIRUSSTATE.DYING, 10, nextState);


            this.board[y][x] = SETTINGS.defaultBottleValue;

            this.scoreToAdd += SETTINGS.virusScore;
        }
    }


    /**
     * @param {Number} count
     */
    InfectBoard(count) {
        let m = SETTINGS.minVirusDepth * SETTINGS.bottleWidth;
        let l = SETTINGS.bottleHeight * SETTINGS.bottleWidth;

        if (count > l - m) {
            count = l - m;
        }

        let t = [];

        for (let i = 0; i < l - m; i++) {
            t.push(m + i);
        }

        for (let i = 0; i < count; i++) {
            let r = t[Math.floor(t.length * Math.random())];

            let x = r % SETTINGS.bottleWidth;
            let y = (r - x) / SETTINGS.bottleWidth;

            t.splice(t.indexOf(r), 1);

            let vColor = SETTINGS.virusColor[i % SETTINGS.virusColor.length];

            this.virus[vColor]++;

            let v = new Virus(x, y, vColor);

            this.board[y][x] = v;
        }
    }

    PopElement(x, y) {
        let v = this.board[y][x];

        let c;
        let t;

        if (v instanceof Virus) {
            c = v.color;
            t = "virus";
        } else if (v instanceof Pill) {
            t = "pill";

            if (v.x == x && v.y == y) {
                c = v.color[0].toLowerCase();
            } else {
                c = v.color[1].toLowerCase();
            }
        }

        this.tileList[y * SETTINGS.bottleWidth + x].style.backgroundImage = `url(${gr.Get(`${t}.${c}.pop`)})`;

        setTimeout(() => {
            this.tileList[y * SETTINGS.bottleWidth + x].style.backgroundImage = "";
        }, SETTINGS.pillPopTime);
    }

    StartGame() {
        this.UpdateCounters();

        this.PickAmbientColor();

        this.RegisterInputManager();

        this.InfectBoard(this.counter.virus.value);

        this.DrawBoard();

        setTimeout(() => {
            this.NextPill()
        }, 1000);
    }

    PickAmbientColor(color) {
        if (color === undefined) {
            color = SETTINGS.ambientColor[this.counter.level.value % SETTINGS.ambientColor.length];
        }

        this.DOMAmbient.SetColor(color);
        this.overlay.ChangeAmbient(color);
    }

    UpdateCounters() {
        if (localStorage.getItem(SETTINGS.bestScorePrefix) != null) {
            this.counter.topScore.Set(parseInt(localStorage.getItem(SETTINGS.bestScorePrefix)));
        }

        this.counter.virus.Set(this.counter.level.value * 4 + 4);
    }

    OnWin() {
        this.overlay.Set("COMPLETE");

        this.complete = true;
        this.canMove[0] = true;;
    }

    OnLose() {
        if (this.counter.currentScore.value > this.counter.topScore.value) {
            localStorage.setItem(SETTINGS.bestScorePrefix, this.counter.currentScore.value.toString());
        }

        this.overlay.Set("GAMEOVER");

        this.canMove[0] = false;

        this.magnifier.Laugh();
        this.pillPreview.Clear();
        this.pillPreview.DOMHandleMario.src = gr.Get("mario.gameover");
    }

    NextStage() {
        if (this.complete == false) {
            return;
        }

        this.inputManager.ResetIntervals();

        this.ApplyGravity(false);

        this.complete = false;
        this.canMove[0] = false;

        this.counter.level.Increment(1);

        this.pills = {};
        this.currentPillID = 0

        this.virus.red = 0;
        this.virus.blue = 0;
        this.virus.yellow = 0;

        this.magnifier.Restart();

        this.board = Util.GenerateArray(SETTINGS.bottleWidth, SETTINGS.bottleHeight, SETTINGS.defaultBottleValue);
        // "shaping" the bottle
        this.board[0][0] = 1;
        this.board[0][1] = 1;
        this.board[0][2] = 1;
        this.board[0][5] = 1;
        this.board[0][6] = 1;
        this.board[0][7] = 1;

        this.overlay.Hide();

        this.UpdateCounters();

        this.PickAmbientColor();

        this.InfectBoard(this.counter.virus.value);

        this.DrawBoard();

        setTimeout(() => {
            this.NextPill();
        }, 1000);
    }
}