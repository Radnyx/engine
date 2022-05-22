import ECS from "@trixt0r/ecs";
import Game from "Game";
import { Container } from "pixi.js";

export default abstract class Scene {
    protected readonly engine: ECS.Engine;
    protected readonly stage: Container;

    constructor() {
        this.engine = new ECS.Engine;
        this.stage = new Container;
    }

    update(delta: number) {
        this.engine.run(delta);
    }

    onLoad(game: Game) {
        game.app.stage.addChild(this.stage);
    }

    onDestroy(game: Game) {
        game.app.stage.removeChild(this.stage);
    }
}