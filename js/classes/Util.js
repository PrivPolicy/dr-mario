"use strict"

class Util {
    static GenerateArray(ix, iy, value = null) {
        let a = [];

        for (let y = 0; y < iy; y++) {
            a.push([]);

            for (let x = 0; x < ix; x++) {
                a[y].push(value);
            }
        }

        return a;
    }

    static ResolveMoveDirection(dir) {
        let out;

        if (dir == MOVE.UP) { out = [0, -1]; }
        else if (dir == MOVE.DOWN) { out = [0, 1]; }
        else if (dir == MOVE.LEFT) { out = [-1, 0]; }
        else if (dir == MOVE.RIGHT) { out = [1, 0]; }

        return out;
    }

    static GetRandomColor(count = 2) {
        let c = [];

        for (let i = 0; i < count; i++) {
            let a = Object.keys(COLOR);
            c.push(a[Math.floor(Math.random() * a.length)]);
        }

        return c;
    }
}