import * as ECS from "@trixt0r/ecs";
import * as Matter from "matter-js";
import Game from "Game";
import { Container, Loader } from "pixi.js";
import { EventBus } from "ts-bus";

export default abstract class Scene {
    public readonly ecs: ECS.Engine;
    public readonly physics: Matter.Engine;
    public readonly stage: Container;
    public readonly bus: EventBus;
    protected readonly loader: Loader;

    constructor(assets: string[]) {
        this.ecs = new ECS.Engine();
        this.physics = Matter.Engine.create();
        this.stage = new Container();
        this.stage.sortableChildren = true;
        this.bus = new EventBus();
        this.loader = new Loader();
        for (const asset of assets) {
            this.loader.add(asset);
        }
    }

    update(delta: number) {
        Matter.Engine.update(this.physics, delta);
        this.ecs.run(delta);
    }

    async onLoad(game: Game) {
        await new Promise(resolve => this.loader.load(resolve));
        console.log(this.loader.resources);
        game.app.stage.addChild(this.stage);
    }

    onDestroy(game: Game) {
        game.app.stage.removeChild(this.stage);
    }
}