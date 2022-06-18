import { GameObject, SpriteComponent } from "../../../src";
import { Prefab } from "../../../src/GameObject";
import { FSMComponent, PlayerComponent, WalkToComponent } from "../component/Components";
import FSMGraph from "../FSMGraph";
import { Condition, Dialogue, Do } from "../Nodes";
import AdventureScene from "../scene/AdventureScene";
import NPCPrefab from "./NPCPrefab";
import * as text from "../../build/assets/text.json";

enum NODES {
    CHOOSE_PATH = 0,
    END = 1,
    TALK_1 = 10,
    TALK_2 = 20
}

export default function CatPrefab(scene: AdventureScene, graph?: FSMGraph): Prefab {
    return (obj: GameObject) => {
        const t = text["cat"];
        const interact = new FSMGraph(
            Condition(NODES.CHOOSE_PATH, [
                { node: NODES.TALK_1 }
            ]),
            Do(NODES.END, () => {
                scene.playerComponent.controllable = true;
            }, FSMGraph.NULL_NODE),
            Dialogue(NODES.TALK_1, scene, "player", t["pspsps"], NODES.TALK_2),
            Dialogue(NODES.TALK_2, scene, obj, t["hungry"], NODES.END),
        );
        return NPCPrefab(scene, interact)(obj);
    };
}