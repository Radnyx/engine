import * as PIXI from "pixi.js";
import Scene from "./Scene";

export default class Game {
    private scene: Scene | undefined;
    public readonly app: PIXI.Application;

    constructor(width: number, height: number) {
        this.app = new PIXI.Application({ width, height });
    }

    start() {
        this.app.ticker.add(delta => {
            this.scene?.update(delta);
        });
    }

    loadScene(scene: Scene) {
        this.scene?.onDestroy(this);
        this.scene = scene;
        scene.onLoad(this);
    }
}
