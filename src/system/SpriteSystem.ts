import { AbstractEntitySystem } from "@trixt0r/ecs";
import { TransformComponent, SpriteComponent, StageComponent } from "component/Components";
import GameObject from "GameObject";

export default class SpriteSystem extends AbstractEntitySystem<GameObject> {
    constructor() {
        super(undefined, [TransformComponent, StageComponent, SpriteComponent]);
    }

    override onAddedComponents(gameObject: GameObject, { x, y }: TransformComponent, { stage }: StageComponent, { sprite }: SpriteComponent) {
        stage.addChild(sprite);
        sprite.x = x;
        sprite.y = y;
    }

    override onRemovedEntities(...gameObjects: GameObject[]) {
        for (const gameObject of gameObjects) {
            const { stage } = gameObject.components.get(StageComponent);
            const { sprite } = gameObject.components.get(SpriteComponent);
            stage.removeChild(sprite);
        }
    }

    override processEntity(gameObject: GameObject) {
        const { x, y } = gameObject.components.get(TransformComponent);
        const { sprite } = gameObject.components.get(SpriteComponent);
        sprite.x = x;
        sprite.y = y;
    }
}