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
        const { body } = gameObject.components.get(PhysicsComponent);
        if (walkTo.position == null || walkTo.speed == null) {
            if (!body.isStatic) {
                Matter.Body.setStatic(body, true);
            }
            return;
        }

        const radius = walkTo.radius || walkTo.speed;
        if (Matter.Vector.magnitude(Matter.Vector.sub(body.position, walkTo.position)) < radius) {
            Matter.Body.setVelocity(body, { x: 0, y: 0 });
            if (walkTo.radius == null) {
                Matter.Body.setPosition(body, walkTo.position);
            }
            walkTo.position = undefined;
            if (!body.isStatic) {
                Matter.Body.setStatic(body, true);
            }
            if (walkTo.done != null) {
                walkTo.done();
            }
            return;
        }

        const angle = Matter.Vector.angle(body.position, walkTo.position);
        const velocity = Matter.Vector.rotate({ x: walkTo.speed, y: 0 }, angle);
        if (body.isStatic) {
            Matter.Body.setStatic(body, false);
        }
        Matter.Body.setVelocity(body, velocity);
    }
}