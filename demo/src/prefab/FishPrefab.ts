import { GameObject, SpriteComponent } from "../../../src";
import { Prefab } from "../../../src/GameObject";
import { FSMComponent, PlayerComponent, WalkToComponent } from "../component/Components";
import FSMGraph from "../FSMGraph";
import { Condition, Dialogue, Do } from "../Nodes";
import AdventureScene from "../scene/AdventureScene";
import NPCPrefab from "./NPCPrefab";
import * as text from "../../build/assets/text.json";

enum NODES {
    CHOOSE_PATH = 0
}

export default function FishPrefab(scene: AdventureScene, graph?: FSMGraph): Prefab {
    return (obj: GameObject) => {
        const t = text["fish"];
        const interact = new FSMGraph(
            Condition(NODES.CHOOSE_PATH, [
               
            ]),
        );
        return NPCPrefab(scene, interact)(obj);
    };
}