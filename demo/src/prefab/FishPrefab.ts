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
    NO_NET = 10,
    NET = 20,
    GET_FISH = 30
}

export default function FishPrefab(scene: AdventureScene, graph?: FSMGraph): Prefab {
    return (obj: GameObject) => {
        const t = text["fish"];
        const interact = new FSMGraph(
            Condition(NODES.CHOOSE_PATH, [
                { 
                    when: () => scene.playerComponent.holding(Item.NET),
                    node: NODES.NET
                },
                { node: NODES.NO_NET }
            ]),
            Do(NODES.END, () => {
                scene.playerComponent.controllable = true;
            }, FSMGraph.NULL_NODE),
            Dialogue(NODES.NO_NET, scene, obj, t["no_net"], NODES.END),
            Dialogue(NODES.NET, scene, obj, t["net"], NODES.GET_FISH),
            Do(NODES.GET_FISH, () => {
                scene.playerComponent.giveItem(Item.FISH);
                scene.ecs.entities.remove(obj);
                scene.playerComponent.controllable = true;
            }, FSMGraph.NULL_NODE)
        );
        return NPCPrefab(scene, interact)(obj);
    };
}