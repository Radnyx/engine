import { GameObject, SpriteComponent } from "../../../src";
import { Prefab } from "../../../src/GameObject";
import { FSMComponent, PlayerComponent, WalkToComponent } from "../component/Components";
import FSMGraph from "../FSMGraph";
import { Condition, Dialogue, Do } from "../Nodes";
import AdventureScene from "../scene/AdventureScene";
import NPCPrefab from "./NPCPrefab";
import * as text from "../../build/assets/text.json";
import { Item } from "../Item";

enum NODES {
    CHOOSE_PATH = 0,
    END = 1,
    TALK_1 = 10,
    TALK_2 = 20,
    GIVE_FISH = 30,
    GET_CAT = 40
}

export default function CatPrefab(scene: AdventureScene, graph?: FSMGraph): Prefab {
    return (obj: GameObject) => {
        const t = text["cat"];
        const interact = new FSMGraph(
            Condition(NODES.CHOOSE_PATH, [
                { 
                    when: () => scene.playerComponent.holding(Item.FISH),
                    node: NODES.GET_CAT 
                },
                { node: NODES.TALK_1 }
            ]),
            Do(NODES.END, () => {
                scene.playerComponent.controllable = true;
            }, FSMGraph.NULL_NODE),
            Dialogue(NODES.TALK_1, scene, "player", t["pspsps"], NODES.TALK_2),
            Dialogue(NODES.TALK_2, scene, obj, t["hungry"], NODES.END),
            // Dialogue(NODES.GIVE_FISH, scene, obj, t["give_fish"], NODES.GET_CAT),
            Do(NODES.GET_CAT, () => {
                scene.playerComponent.giveItem(Item.CAT);
                scene.ecs.entities.remove(obj);
                scene.playerComponent.controllable = true;
            }, FSMGraph.NULL_NODE)
        );
        return NPCPrefab(scene, interact)(obj);
    };
}