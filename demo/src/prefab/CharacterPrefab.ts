import Matter from "matter-js";
import { Sprite, Texture } from "pixi.js";
import { GameObject, PhysicsComponent, Scene, SpriteComponent, StageComponent, TransformComponent } from "../../../src";
import { Prefab } from "../../../src/GameObject";
import { WalkToComponent } from "../component/Components";

export default function CharacterPrefab(
    scene: Scene,
    x: number, y: number, 
    width: number, height: number
): Prefab {
    return (obj: GameObject) => {
        const spr = Sprite.from(Texture.WHITE);
        spr.anchor.set(0.5);
        spr.width = width;
        spr.height = height;
        spr.interactive = true;
        obj.components.add(...[
            new TransformComponent(),
            new SpriteComponent(spr),
            new StageComponent(scene.stage),
            new WalkToComponent(),
            new PhysicsComponent(scene.physics.world, 
                Matter.Bodies.rectangle(x, y, width, height, { inertia: Infinity }))
        ]);
        return obj;
    };
}