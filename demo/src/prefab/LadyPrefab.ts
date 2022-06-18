import GameObject, { Prefab } from "../../../src/GameObject";
import FSMGraph from "../FSMGraph";
import { Item } from "../Item";
import { Condition, Dialogue, Do, Select } from "../States";
import NPCPrefab from "./NPCPrefab";
import * as text from "../../build/assets/text.json";
import AdventureScene from "../scene/AdventureScene";

enum NODES {
    CHOOSE_PATH = 0,
    END = 1,
    INTRO_NO_ROSE = 2,
    DELIVERED_ROSE = 3,
    SELECT_SENDER = 10,
    WAS_POET = 11,
    WAS_I = 20,
    GET_LETTER_POET = 30,
    GET_LETTER_I = 31,
    END_WAS_POET = 32,
    END_WAS_I = 40,
    AFTER_GOT_LETTER = 50,
    SELECT_CHAT = 51,
    DRESS_MODESTLY = 52,
    NEVERMIND = 60,
}

export default function LadyPrefab(scene: AdventureScene): Prefab {
    return (lady: GameObject) => {
        const interactWithLady = new FSMGraph(
            Condition(NODES.CHOOSE_PATH, [
                {
                    when: () => scene.playerComponent.gameState.gotLetter,
                    node: NODES.AFTER_GOT_LETTER
                },
                {
                    when: () => scene.playerComponent.holding(Item.ROSE),
                    node: NODES.DELIVERED_ROSE
                },
                {
                    when: () => true,
                    node: NODES.INTRO_NO_ROSE
                }
            ]),
            Do(NODES.END, () => {
                scene.playerComponent.controllable = true;
            }, FSMGraph.NULL_NODE),
            Dialogue(NODES.INTRO_NO_ROSE, scene, lady, text["lady"]["intro_no_rose"], NODES.END),
            Dialogue(NODES.DELIVERED_ROSE, scene, lady, text["lady"]["delivered_rose"], NODES.SELECT_SENDER),
            Select(NODES.SELECT_SENDER, scene, text["lady"]["select_sender"], [ NODES.WAS_POET, NODES.WAS_I ]),
            Dialogue(NODES.WAS_POET, scene, lady, text["lady"]["was_poet"], NODES.GET_LETTER_POET),
            Do(NODES.GET_LETTER_POET, () => {
                scene.playerComponent.giveItem(Item.LETTER);
                scene.playerComponent.gameState.gotLetter = true;
            }, NODES.END_WAS_POET),
            Dialogue(NODES.END_WAS_POET, scene, lady, text["lady"]["end_was_poet"], NODES.END),
            Dialogue(NODES.WAS_I, scene, lady, text["lady"]["was_i"], NODES.GET_LETTER_I),
            Do(NODES.GET_LETTER_I, () => {
                scene.playerComponent.giveItem(Item.LETTER);
                scene.playerComponent.gameState.gotLetter = true;
            }, NODES.END_WAS_I),
            Dialogue(NODES.END_WAS_I, scene, lady, text["lady"]["end_was_i"], NODES.END),

            Dialogue(NODES.AFTER_GOT_LETTER, scene, lady, text["lady"]["after_got_letter"]),
            Select(NODES.SELECT_CHAT, scene, text["lady"]["select_chat"], [ NODES.DRESS_MODESTLY, NODES.NEVERMIND ]),
            Dialogue(NODES.DRESS_MODESTLY, scene, lady, text["lady"]["dress_modestly"], NODES.SELECT_CHAT),
            Dialogue(NODES.NEVERMIND, scene, lady, text["lady"]["nevermind"], NODES.END)

        );
        return NPCPrefab(scene, interactWithLady)(lady);
    };
}