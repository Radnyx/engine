import PIXI from "pixi.js";
import Scene from "./Scene";

export default class Game {
    private scene: Scene | null;
    public readonly app: PIXI.Application;

    constructor(width: number, height: number) {
        this.scene = null;
        this.app = new PIXI.Application({ width, height });
    }

    run() {
        this.app.ticker.add(delta => {
            this.scene?.update(delta);
        });
    }
}
