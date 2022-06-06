import { AbstractEntitySystem } from "@trixt0r/ecs";
import { GameObject, PhysicsComponent } from "../../../src";
import { PlayerComponent, WalkToComponent } from "../component/Components";

export default class PlayerSystem extends AbstractEntitySystem<GameObject> {
    constructor() {
        super(undefined, [PlayerComponent, PhysicsComponent, WalkToComponent]);
    }

    override processEntity(gameObject: GameObject): void {}
}