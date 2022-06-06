import Matter from "matter-js";
import { Sprite, Texture } from "pixi.js";
import { GameObject, PhysicsComponent, Scene, SpriteComponent, StageComponent, TransformComponent } from "../../../src";
import { PlayerComponent, WalkToComponent } from "../component/Components";

export default function CharacterPrefab(
    scene: Scene,
    x: number, y: number, width: number, height: number
) {
    const obj = new GameObject();
    obj.components.add(new TransformComponent());
    const spr = Sprite.from(Texture.WHITE);
    spr.width = width;
    spr.height = height;
    obj.components.add(new SpriteComponent(spr));
    obj.components.add(new StageComponent(scene.stage));
    obj.components.add(new WalkToComponent());
    obj.components.add(new PhysicsComponent(scene.physics.world, 
        Matter.Bodies.rectangle(x, y, width, height, { })));
    return obj;
}