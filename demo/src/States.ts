import { Text, TextStyle } from "pixi.js";
import { GameObject, Scene, SpriteComponent, TransformComponent } from "../../src";
import { FSMComponent, PlayerComponent } from "./component/Components";
import { Node } from "./FSMGraph";
import { clickStageMessage } from "./Messages";
import TextPrefab from "./prefab/TextPrefab";
import TextStyles from "./TextStyles";

function Dialogue(id: number, scene: Scene, object: GameObject, text: string, nextNode?: number): Node {
    return {
        id,
        enter: fsm => {
            scene.ecs.entities.get("player").components.get(PlayerComponent).controllable = false;
            const textObject = TextPrefab(scene, text, TextStyles.DIALOGUE)(new GameObject());
            textObject.components.add(new TransformComponent(0, -50, 0, object.components.get(TransformComponent)));
            textObject.components.get(SpriteComponent).sprite.anchor.set(0.5, 1);
            scene.ecs.entities.add(textObject);
            const unsubscribe = scene.bus.subscribe(clickStageMessage, () => {
                fsm.execute(nextNode || (id + 1));
            });
            // exit
            return () => {
                scene.ecs.entities.remove(textObject);
                unsubscribe();
            };
        }
    };
}

function Dialogues(id: number, scene: Scene, object: GameObject, text: string[], nextNode?: number): Node[] {
    return text.map((x, i) => Dialogue(id + i, scene, object, x, i == text.length - 1 ? nextNode : null));
}

function Select(id: number, scene: Scene, options: string[], nextNodes?: number[]): Node {
    return {
        id,
        enter: fsm => {
            const optionObjects = [];
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                const optionObject = TextPrefab(scene, "• " + option, TextStyles.OPTION)(new GameObject());
                optionObject.components.add(new TransformComponent(25, 25 + 50 * i));
                const text = optionObject.components.get(SpriteComponent).sprite as Text;
                text.anchor.set(0, 0.5);
				text.interactive = true;
				text.buttonMode = true;
                text.on("mouseover", () => text.style = TextStyles.HOVER_OPTION);
				text.on("mouseout", () => text.style = TextStyles.OPTION);
                text.on("click", e => {
                    e.stopPropagation();
                    if (nextNodes == null) {
                        fsm.execute(id + 1);
                    } else {
                        fsm.execute(nextNodes[i]);
                    }
                });
                scene.ecs.entities.add(optionObject);
                optionObjects.push(optionObject);
            }
            return () => {
                scene.ecs.entities.remove(...optionObjects);
            }
        }
    }
}

function Do(id: number, fun: () => void, nextNode?: number): Node {
    return {
        id,
        run: fsm => {
            fun();
            fsm.execute(nextNode || (id + 1))
        }
    };
}

export { Dialogue, Dialogues, Select, Do };