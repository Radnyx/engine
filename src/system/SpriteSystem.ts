import { AbstractEntity, AbstractEntitySystem, Component, EntityListener } from "@trixt0r/ecs";
import { TransformComponent, SpriteComponent, StageComponent } from "component/Components";
import GameObject from "GameObject";
import MathUtil from "MathUtil";
import { Sprite } from "pixi.js";
import Priority from "./Priority";

export default class SpriteSystem extends AbstractEntitySystem<GameObject> {
    constructor() {
        super(Priority.SPRITE, [TransformComponent, StageComponent, SpriteComponent]);
    }

    private snapToTransform(
        transform: TransformComponent, 
        { stage }: StageComponent,
        { sprite, options: { keepWithin } }: SpriteComponent
    ) {
        const worldPosition = transform.getWorldPosition();
        sprite.x = worldPosition.x;
        sprite.y = worldPosition.y;
        sprite.rotation = transform.angle;

        if (keepWithin != null) {
            const anchorX = sprite.width * sprite.anchor.x;
            const anchorY = sprite.height * sprite.anchor.y;
            sprite.x = MathUtil.clamp(sprite.x, keepWithin.x + anchorX, keepWithin.width - sprite.width + anchorX);
            sprite.y = MathUtil.clamp(sprite.y, keepWithin.y + anchorY, keepWithin.height - sprite.height + anchorY);
        }
    }

    override onAddedEntities(...gameObjects: GameObject[]): void {
        for (const gameObject of gameObjects) {
            const transform = gameObject.components.get(TransformComponent);
            const stageComponent = gameObject.components.get(StageComponent);
            const spriteComponent = gameObject.components.get(SpriteComponent);
            stageComponent.stage.addChild(spriteComponent.sprite);
            this.snapToTransform(transform, stageComponent, spriteComponent);
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
        const stageComponent = gameObject.components.get(StageComponent);
        const spriteComponent = gameObject.components.get(SpriteComponent);
        this.snapToTransform(transform, stageComponent, spriteComponent);
    }
}