import { Scene } from "../../../src";
import GameObject, { Prefab } from "../../../src/GameObject";
import FSMGraph from "../FSMGraph";
import NPCPrefab from "./NPCPrefab";
import * as text from "../../assets/text.json";
import { Dialogues, Select } from "../States";

enum NODES {
    DIALOGUE_INTRO = 0,
    SELECT_OPINION = 10,
    INSTRUCT,
    RECEIVE_ROSE = 20
}

export default function PoetPrefab(scene: Scene): Prefab {
    return (poet: GameObject) => {
        const interactWithPoet = new FSMGraph(
            ...Dialogues(NODES.DIALOGUE_INTRO, scene, poet, text["poet"]["intro"], NODES.SELECT_OPINION),
            Select(NODES.SELECT_OPINION, scene, text["poet"]["opinion"]),
            ...Dialogues(NODES.INSTRUCT, scene, poet, text["poet"]["instruct"], NODES.RECEIVE_ROSE),
            {
                id: NODES.RECEIVE_ROSE,
                enter: fsm => {
                    
                }
            }
        );

        return NPCPrefab(scene, interactWithPoet)(poet);
    };
}