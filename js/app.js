"use strict"

//#region SETTINGS
const SETTINGS = {
    bottleWidth: 8,
    bottleHeight: 16 + 1,
    bottleStartX: 3,
    bottleStartY: 0 + 1,
    pillGravityDelay: 600,
    pillGravityDelayForced: 30,
    boardGravityDelay: 50,
    pillPreviewAnimationDelay: 15,
    nextPillDelay: 500,
    pillPopTime: 100,
    defaultBottleValue: 0,
    minVirusDepth: 6,
    virusColor: ["red", "blue", "yellow"],
    ambientColor: ["#901829", "#008267", "#ffb68c", "#837e85", "#123eb2"],
    bestScorePrefix: "fk-drmario-top-score",
    virusScore: 100
}
//#endregion

//#region CREATE PAGE LAYOUT
let p = document.createElement("div");
p.id = "page-container";
let g = document.createElement("div");
g.id = "game-container";

p.appendChild(g);
document.body.prepend(p);
//#endregion

let gr = new GraphicResolver(".");
gr.LoadFromObject(resources);
gr.Preload();

let DrMario = new Game(g, SETTINGS.bottleWidth, SETTINGS.bottleHeight);
DrMario.StartGame();