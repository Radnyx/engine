import { AbstractEntity, AbstractEntitySystem, Component, EntityListener } from "@trixt0r/ecs";
import { TransformComponent, SpriteComponent, StageComponent } from "component/Components";
import GameObject from "GameObject";
import Priority from "./Priority";

export default class SpriteSystem extends AbstractEntitySystem<GameObject> {
    constructor() {
        super(Priority.SPRITE, [TransformComponent, StageComponent, SpriteComponent]);
    }

    override onAddedEntities(...gameObjects: GameObject[]): void {
        for (const gameObject of gameObjects) {
            const { x, y } = gameObject.components.get(TransformComponent);
            const { stage } = gameObject.components.get(StageComponent);
            const { sprite } = gameObject.components.get(SpriteComponent);
            stage.addChild(sprite);
            sprite.anchor.set(0.5);
            sprite.x = x;
            sprite.y = y;
        }
    }

    override onRemovedEntities(...gameObjects: GameObject[]) {
        for (const gameObject of gameObjects) {
            const { stage } = gameObject.components.get(StageComponent);
            const { sprite } = gameObject.components.get(SpriteComponent);
            stage.removeChild(sprite);
        }
    }

    override processEntity(gameObject: GameObject) {
        const { x, y, angle } = gameObject.components.get(TransformComponent);
        const { sprite } = gameObject.components.get(SpriteComponent);
        sprite.x = x;
        sprite.y = y;
        sprite.rotation = angle;
    }
}