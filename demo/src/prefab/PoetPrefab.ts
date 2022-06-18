import GameObject, { Prefab } from "../../../src/GameObject";
import FSMGraph from "../FSMGraph";
import NPCPrefab from "./NPCPrefab";
import * as text from "../../build/assets/text.json";
import { Dialogue, Select, Do, Condition } from "../Nodes";
import { Item } from "../Item";
import AdventureScene from "../scene/AdventureScene";

enum NODES {
    CHOOSE_PATH = 0,
    DIALOGUE_INTRO,
    SELECT_OPINION = 10,
    INSTRUCT,
    RECEIVE_ROSE = 20,
    SELECT_GIVEN_ROSE,
    GOODBYE,
    END_INTRO,
    REPEAT_INSTRUCT
}

export default function PoetPrefab(scene: AdventureScene): Prefab {
    return (poet: GameObject) => {
        const interactWithPoet = new FSMGraph(
            Condition(NODES.CHOOSE_PATH, [
                {
                    when: () => scene.playerComponent.gameState.metPoet,
                    node: NODES.REPEAT_INSTRUCT
                },
                { node: NODES.DIALOGUE_INTRO }
            ]),
            Dialogue(NODES.DIALOGUE_INTRO, scene, poet, text["poet"]["intro"], NODES.SELECT_OPINION),
            Select(NODES.SELECT_OPINION, scene, text["poet"]["opinion"]),
            Dialogue(NODES.INSTRUCT, scene, poet, text["poet"]["instruct"], NODES.RECEIVE_ROSE),
            Do(NODES.RECEIVE_ROSE, () => {
                scene.playerComponent.giveItem(Item.ROSE);
            }),
            Select(NODES.SELECT_GIVEN_ROSE, scene, text["poet"]["given_rose"]),
            Dialogue(NODES.GOODBYE, scene, poet, text["poet"]["goodbye"]),
            Do(NODES.END_INTRO, () => {
                scene.playerComponent.controllable = true;
                scene.playerComponent.gameState.metPoet = true;
            }, FSMGraph.NULL_NODE),
            Dialogue(NODES.REPEAT_INSTRUCT, scene, poet, text["poet"]["repeat_instruct"], NODES.END_INTRO)
        );
        return NPCPrefab(scene, interactWithPoet)(poet);
    };
}