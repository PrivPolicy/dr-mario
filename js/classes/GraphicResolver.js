class GraphicResolver {
    /**
     * @param {String} pathDelimeter character separating path parts
     */
    constructor(pathDelimeter) {
        this.pathDelimeter = pathDelimeter;

        this.data = {};

        this.preload = [];
    }

    /**
     * @param {String} path path to resource
     * @param {String} value value
     */
    Register(path, value) {
        try {
            let a = path.split(this.pathDelimeter);

            let e = this.data;

            for (let i = 0; i < a.length - 1; i++) {
                if (e[a[i]] === undefined) {
                    e[a[i]] = {};
                }

                e = e[a[i]];
            }

            if (e[a[a.length - 1]] === undefined || typeof (e[a[a.length - 1]]) == "string") {
                e[a[a.length - 1]] = value;
            }
        } catch (err) { }
    }

    /**
     * @param {String} path
     */
    Get(path) {
        try {
            let a = path.split(this.pathDelimeter);

            let e = this.data;

            for (let i = 0; i < a.length - 1; i++) {
                e = e[a[i]];
            }

            return e[a[a.length - 1]];

        } catch (err) { }
    }

    get JSONData() {
        return JSON.stringify(this.data);
    }

    Preload(object = this.data) {
        if (object == this.data) { this.preload = []; }

        //@ts-ignore
        let k = Object.values(object);

        k.forEach(element => {
            if (typeof (element) == "object") {
                this.Preload(element);
            } else {
                let e = document.createElement("img");
                e.src = element;

                this.preload.push(e);
            }
        });
    }

    LoadFromObject(object) {
        this.data = JSON.parse(JSON.stringify(object));
    }
}