import { Rectangle, Text } from "pixi.js";
import { GameObject, Scene, SpriteComponent, TransformComponent } from "../../src";
import { PlayerComponent } from "./component/Components";
import { Node } from "./FSMGraph";
import { clickStageMessage } from "./Messages";
import TextPrefab from "./prefab/TextPrefab";
import AdventureScene from "./scene/AdventureScene";
import TextStyles from "./TextStyles";


function template(str: string, map: { [name: string]: string }) { 
    return str.replace(/{([^{}]+)}/g, function(_, key) {
        return map[key] || "";
    });
}

function DialogueHelper(
    id: number, 
    scene: AdventureScene, 
    object: string | GameObject, 
    text: string, 
    nextNode: number | undefined,
    action?: (() => void) | undefined
): Node {
    return {
        id,
        enter: fsm => {
            action && action();
            const obj = typeof object === "string" 
                ? scene.ecs.entities.get(object) 
                : object;
            scene.playerComponent.controllable = false;
            const textObject = TextPrefab(scene, text, TextStyles.DIALOGUE)(new GameObject());
            textObject.components.add(new TransformComponent(0, -25, 0, obj.components.get(TransformComponent)));
            const textComponent = textObject.components.get(SpriteComponent);
            textComponent.options.keepWithin = new Rectangle(20, 20, scene.width - 20, scene.height - 20);
            textComponent.sprite.anchor.set(0.5, 1);
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

function Dialogue(
    id: number, 
    scene: AdventureScene, 
    object: string | GameObject, 
    text: string | string[], 
    nextNode?: number,
    action?: () => void
): Node | Node[] {
    if (Array.isArray(text)) {
        return text.map((x, i) => 
            DialogueHelper(
                id + i, 
                scene, 
                object, 
                x, 
                i == text.length - 1 ? nextNode : undefined,
                i == 0 ? action : undefined
            )
        );
    }
    return DialogueHelper(id, scene, object, text, nextNode, action);
}

function Select(
    id: number, 
    scene: AdventureScene, 
    options: string[],
    nextNodes?: number | (number | { node: number, when: () => boolean })[]
): Node {
    return {
        id,
        enter: fsm => {
            const templates = {
                "item": scene.playerComponent.itemName()
            };
            const optionObjects: GameObject[] = [];
            let yPos = 25;
            for (let i = 0; i < options.length; i++) {
                let nextNode: number = id + 1;
                if (nextNodes != null) {
                    if (typeof nextNodes === "number") {
                        nextNode = nextNodes;
                    } else {
                        let nextNodeElem = nextNodes[i];
                        if (typeof nextNodeElem === "number") {
                            nextNode = nextNodeElem;
                        } else if (nextNodeElem.when()) {
                            nextNode = nextNodeElem.node;
                        } else {
                            continue;
                        }
                    }
                }
                const option = template(options[i], templates);
                const optionObject = TextPrefab(scene, "• " + option, TextStyles.OPTION)(new GameObject());
                optionObject.components.add(new TransformComponent(25, yPos));
                const text = optionObject.components.get(SpriteComponent).sprite as Text;
                text.anchor.set(0, 0.5);
				text.interactive = true;
				text.buttonMode = true;
                text.on("mouseover", () => text.style = TextStyles.HOVER_OPTION);
				text.on("mouseout", () => text.style = TextStyles.OPTION);
                text.on("click", e => {
                    e.stopPropagation();
                    fsm.execute(nextNode);
                });
                scene.ecs.entities.add(optionObject);
                optionObjects.push(optionObject);
                yPos += 50;
            }
            return () => {
                scene.ecs.entities.remove(...optionObjects);
            }
        },
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

function Condition(id: number, conditions: { when?: () => boolean | undefined, node: number }[] ): Node {
    return {
        id,
        run: fsm => {
            for (const { when, node } of conditions) {
                if (when == null || when()) {
                    fsm.execute(node);
                    return;
                }
            }
        }
    };
}

export { Dialogue, Select, Do, Condition };