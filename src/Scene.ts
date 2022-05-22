import ECS from "@trixt0r/ecs";
import Game from "Game";

export default abstract class Scene {
    private readonly engine: ECS.Engine;

    constructor() {
        this.engine = new ECS.Engine;
    }

    update(delta: number) {
        this.engine.run(delta);
    }

    abstract onLoad(game: Game): void;
    abstract onDestroy(game: Game): void;
}