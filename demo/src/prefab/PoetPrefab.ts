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
    REPEAT_INSTRUCT,
    OPINION_RESPONSE_1 = 30,
    OPINION_RESPONSE_2 = 40,
    OPINION_RESPONSE_3 = 50,
    TOO_ELEVATED = 60,
    DELIVER_IT_YOURSELF = 70,
    DAILY_ROUTINE = 80
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
            Select(NODES.SELECT_OPINION, scene, text["poet"]["opinion"], [
                NODES.OPINION_RESPONSE_1,
                NODES.OPINION_RESPONSE_2,
                NODES.OPINION_RESPONSE_3
            ]),
            Dialogue(NODES.OPINION_RESPONSE_1, scene, poet, text["poet"]["opinion_response"][0], NODES.INSTRUCT),
            Dialogue(NODES.OPINION_RESPONSE_2, scene, poet, text["poet"]["opinion_response"][1], NODES.INSTRUCT),
            Dialogue(NODES.OPINION_RESPONSE_3, scene, poet, text["poet"]["opinion_response"][2], NODES.INSTRUCT),
            Dialogue(NODES.INSTRUCT, scene, poet, text["poet"]["instruct"], NODES.RECEIVE_ROSE),
            Do(NODES.RECEIVE_ROSE, () => {
                scene.playerComponent.giveItem(Item.ROSE);
            }),
            Select(NODES.SELECT_GIVEN_ROSE, scene, text["poet"]["given_rose"], [
                NODES.TOO_ELEVATED,
                NODES.DELIVER_IT_YOURSELF,
                NODES.DAILY_ROUTINE
            ]),
            Dialogue(NODES.TOO_ELEVATED, scene, poet, text["poet"]["too_elevated"], NODES.GOODBYE),
            Dialogue(NODES.DELIVER_IT_YOURSELF, scene, poet, text["poet"]["deliver_it_yourself"], NODES.GOODBYE),
            Dialogue(NODES.DAILY_ROUTINE, scene, poet, text["poet"]["daily_routine"], NODES.GOODBYE),
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