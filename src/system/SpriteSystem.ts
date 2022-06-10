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
            const transform = gameObject.components.get(TransformComponent);
            const worldPosition = transform.getWorldPosition();
            const { stage } = gameObject.components.get(StageComponent);
            const { sprite } = gameObject.components.get(SpriteComponent);
            stage.addChild(sprite);
            sprite.x = worldPosition.x;
            sprite.y = worldPosition.y;
            sprite.rotation = transform.angle;
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
        const transform = gameObject.components.get(TransformComponent);
        const worldPosition = transform.getWorldPosition();
        const { sprite } = gameObject.components.get(SpriteComponent);
        sprite.x = worldPosition.x;
        sprite.y = worldPosition.y;
        sprite.rotation = transform.angle;
    }
}