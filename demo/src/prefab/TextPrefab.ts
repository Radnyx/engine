import { GameObject, Scene, SpriteComponent, StageComponent } from "../../../src";
import TextStyles from "../TextStyles";
import { Text, TextStyle } from "pixi.js";

export default function TextPrefab(scene: Scene, text: string, style: TextStyle) {
    return (gameObject: GameObject) => {
        gameObject.components.add(new StageComponent(scene.stage));
        const textSprite = new Text(text, style);
        textSprite.zIndex = 1;
        gameObject.components.add(new SpriteComponent(textSprite));
        return gameObject;
    };
}