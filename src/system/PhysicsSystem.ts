import { AbstractEntitySystem } from "@trixt0r/ecs";
import { TransformComponent, PhysicsComponent } from "component/Components";
import GameObject from "GameObject";
import { Composite } from "matter-js";
import Priority from "./Priority";

export default class PhysicsSystem extends AbstractEntitySystem<GameObject> {
    constructor() {
        super(Priority.PHYSICS, [TransformComponent, PhysicsComponent]);
    }

    override onAddedEntities(...gameObjects: GameObject[]): void {
        for (const gameObject of gameObjects) {
            const transform = gameObject.components.get(TransformComponent);
            const { world, body } = gameObject.components.get(PhysicsComponent);
            Composite.add(world, [body]);
            transform.x = body.position.x;
            transform.y = body.position.y;
        }
    }

    processEntity(gameObject: GameObject): void {
        const transform = gameObject.components.get(TransformComponent);
        const { body } = gameObject.components.get(PhysicsComponent);
        transform.x = body.position.x;
        transform.y = body.position.y;
        transform.angle = body.angle;
    }
}