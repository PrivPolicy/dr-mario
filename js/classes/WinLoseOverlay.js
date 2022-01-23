class WinLoseOverlay {
    /**
     * @param {HTMLDivElement} DOMHandle
     */
    constructor(DOMHandle) {
        this.DOMHandle = DOMHandle;

        this.ambient = null;
        this.foreground = null;

        this.CreateDOMElements();


    }

    CreateDOMElements() {
        this.ambient = document.createElement("div");
        this.foreground = document.createElement("div");

        this.DOMHandle.appendChild(this.ambient);
        this.DOMHandle.appendChild(this.foreground);
    }

    Show() {
        this.DOMHandle.style.display = "block";
    }

    Hide() {
        this.DOMHandle.style.display = "none";
    }

    Move(x, y) {
        this.DOMHandle.style.left = `${x}px`;
        this.DOMHandle.style.top = `${y}px`;
    }

    /**
     * @param {"GAMEOVER"|"COMPLETE"} state
     */
    Set(state) {
        if (state == OVERLAY.COMPLETE) {
            this.Move(288, 192);

            this.foreground.style.backgroundImage = `url(${gr.Get("state.complete")})`;

            this.DOMHandle.style.width = "432px";
            this.DOMHandle.style.height = "120px";

            this.Show();
        } else if (state == OVERLAY.GAMEOVER) {
            this.Move(336, 192);

            this.foreground.style.backgroundImage = `url(${gr.Get("state.gameover")})`;

            this.DOMHandle.style.width = "336px";
            this.DOMHandle.style.height = "120px";

            this.Show();
        }
    }

    ChangeAmbient(color) {
        this.ambient.style.backgroundColor = color;
    }
}