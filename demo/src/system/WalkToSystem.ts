import { AbstractEntitySystem } from "@trixt0r/ecs";
import Matter from "matter-js";
import { GameObject, PhysicsComponent } from "../../../src";
import { WalkToComponent } from "../component/Components";

export default class WalkToSystem extends AbstractEntitySystem<GameObject> {
    constructor() {
        super(undefined, [PhysicsComponent, WalkToComponent]);
    }

    override processEntity(gameObject: GameObject): void {
        const walkTo = gameObject.components.get(WalkToComponent);
        if (walkTo.position == null || walkTo.speed == null) {
            return;
        }

        const { body } = gameObject.components.get(PhysicsComponent);
        if (Matter.Vector.magnitude(Matter.Vector.sub(body.position, walkTo.position)) < walkTo.speed) {
            Matter.Body.setVelocity(body, { x: 0, y: 0 });
            Matter.Body.setPosition(body, walkTo.position);
            walkTo.position = undefined;
            return;
        }

        const angle = Matter.Vector.angle(body.position, walkTo.position);
        const velocity = Matter.Vector.rotate({ x: walkTo.speed, y: 0 }, angle);
        Matter.Body.setVelocity(body, velocity);
    }
}