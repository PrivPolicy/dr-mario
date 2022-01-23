class Counter {

    /**
     * @param {HTMLElement} DOMHandle
     * @param {Number} width
     */
    constructor(DOMHandle, width) {
        this.DOMHandle = DOMHandle;
        this.width = width;
        this.value = 0;

        this.Update();
    }

    /**
     * @param {Number} value
     */
    Increment(value) {
        this.value += value;
        this.Update();
    }

    /**
     * @param {Number} value
     */
    Decrement(value) {
        this.value -= value;
        this.Update();
    }

    /**
     * @param {Number} value
     */
    Set(value) {
        this.value = value;
        this.Update();
    }

    Update() {
        this.DOMHandle.innerHTML = "";

        let s = this.value.toString();

        while (s.length < this.width) {
            s = `0${s}`;
        }

        for (let i = 0; i < s.length; i++) {
            let p = document.createElement("img");
            p.src = `${gr.Get(`digit.${s[i]}`)}`;

            this.DOMHandle.appendChild(p);
        }
    }
}