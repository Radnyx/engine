import * as ECS from "@trixt0r/ecs";
import * as Matter from "matter-js";
import Game from "Game";
import { Container } from "pixi.js";
import { EventBus } from "ts-bus";

export default abstract class Scene {
    public readonly ecs: ECS.Engine;
    public readonly physics: Matter.Engine;
    public readonly stage: Container;
    public readonly bus: EventBus;

    constructor() {
        this.ecs = new ECS.Engine();
        this.physics = Matter.Engine.create();
        this.stage = new Container();
        this.bus = new EventBus();
    }

    update(delta: number) {
        Matter.Engine.update(this.physics, delta);
        this.ecs.run(delta);
    }

    onLoad(game: Game) {
        game.app.stage.addChild(this.stage);
    }

    onDestroy(game: Game) {
        game.app.stage.removeChild(this.stage);
    }
}