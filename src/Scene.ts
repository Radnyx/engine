import ECS from "@trixt0r/ecs";

export default class Scene {
    private readonly engine: ECS.Engine;

    constructor() {
        this.engine = new ECS.Engine;
    }

    update(delta: number) {
        this.engine.run(delta);
    }
}