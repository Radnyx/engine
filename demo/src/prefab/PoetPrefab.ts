import { Scene } from "../../../src";
import GameObject, { Prefab } from "../../../src/GameObject";
import FSMGraph from "../FSMGraph";
import NPCPrefab from "./NPCPrefab";
import * as text from "../../assets/text.json";
import { Dialogue, Dialogues, Select, Do } from "../States";
import { PlayerComponent } from "../component/Components";
import { Item } from "../Item";

enum NODES {
    DIALOGUE_INTRO = 0,
    SELECT_OPINION = 10,
    INSTRUCT,
    RECEIVE_ROSE = 20,
    SELECT_GIVEN_ROSE,
    GOODBYE,
    END_INTRO
}

export default function PoetPrefab(scene: Scene): Prefab {
    return (poet: GameObject) => {
        const interactWithPoet = new FSMGraph(
            ...Dialogues(NODES.DIALOGUE_INTRO, scene, poet, text["poet"]["intro"], NODES.SELECT_OPINION),
            Select(NODES.SELECT_OPINION, scene, text["poet"]["opinion"]),
            ...Dialogues(NODES.INSTRUCT, scene, poet, text["poet"]["instruct"], NODES.RECEIVE_ROSE),
            Do(NODES.RECEIVE_ROSE, () => {
                scene.ecs.entities.get("player").components.get(PlayerComponent).giveItem(Item.ROSE);
            }),
            Select(NODES.SELECT_GIVEN_ROSE, scene, text["poet"]["given_rose"]),
            Dialogue(NODES.GOODBYE, scene, poet, text["poet"]["goodbye"]),
            Do(NODES.END_INTRO, () => {
                scene.ecs.entities.get("player").components.get(PlayerComponent).controllable = true;
            }, FSMGraph.NULL_NODE)
        );
        return NPCPrefab(scene, interactWithPoet)(poet);
    };
}