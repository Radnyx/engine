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
    INTRO = 2,
    SELECT_INTRO = 10,
    WHAT_HAPPENED = 20,
    LET_ME_HELP = 30,
    SELECT_FISHERMAN = 40,
    YES_FISHERMAN = 50,
    SELECT_YES_FISHERMAN = 60,
    NO_FISHERMAN = 70,
    SELECT_NO_FISHERMAN = 80,
    END_INTRO = 90,
    PERSIST = 100,
    WON = 110,
    FISHERMAN_RESPONSE = 120,
    KEEP_NET = 130,
    GET_NET = 140,
    AFTER = 150
}

export default function MermaidPrefab(scene: AdventureScene): Prefab {
    const t = text["mermaid"];
    return (mermaid: GameObject) => {
        const interact = new FSMGraph(
            Condition(NODES.CHOOSE_PATH, [
                {
                    when: () => scene.playerComponent.gameState.gotNet,
                    node: NODES.AFTER
                },
                {
                    when: () => scene.playerComponent.gameState.metMermaid,
                    node: NODES.PERSIST
                },
                { node: NODES.INTRO }
            ]),
            Do(NODES.END, () => {
                scene.playerComponent.gameState.metMermaid = true;
                scene.playerComponent.controllable = true;
            }, FSMGraph.NULL_NODE),
            // first interaction
            Dialogue(NODES.INTRO, scene, mermaid, t["intro"], NODES.SELECT_INTRO),
            Select(NODES.SELECT_INTRO, scene, t["select_intro"], [
                NODES.WHAT_HAPPENED,
                NODES.LET_ME_HELP    
            ]),
            Dialogue(NODES.WHAT_HAPPENED, scene, mermaid, t["what_happened"], NODES.SELECT_INTRO),
            Dialogue(NODES.LET_ME_HELP, scene, mermaid, t["let_me_help"], NODES.SELECT_FISHERMAN),
            Select(NODES.SELECT_FISHERMAN, scene, t["select_fisherman"], [
                NODES.YES_FISHERMAN,
                NODES.NO_FISHERMAN
            ]),
            Dialogue(NODES.YES_FISHERMAN, scene, mermaid, t["yes_fisherman"], NODES.SELECT_YES_FISHERMAN),
            Select(NODES.SELECT_YES_FISHERMAN, scene, t["select_yes_fisherman"], NODES.END_INTRO),
            Dialogue(NODES.NO_FISHERMAN, scene, mermaid, t["no_fisherman"], NODES.SELECT_NO_FISHERMAN),
            Select(NODES.SELECT_NO_FISHERMAN, scene, t["select_no_fisherman"], NODES.END_INTRO),
            Dialogue(NODES.END_INTRO, scene, mermaid, t["end_intro"], NODES.END),
            // keep talking
            Dialogue(NODES.PERSIST, scene, mermaid, t["persist"], NODES.WON),
            Dialogue(NODES.WON, scene, mermaid, t["won"], NODES.FISHERMAN_RESPONSE),
            Dialogue(NODES.FISHERMAN_RESPONSE, scene, "player", t["fisherman_response"], NODES.KEEP_NET),
            Dialogue(NODES.KEEP_NET, scene, mermaid, t["keep_net"], NODES.GET_NET),
            Do(NODES.GET_NET, () => {
                scene.playerComponent.giveItem(Item.NET);
                scene.playerComponent.gameState.gotNet = true;
            }, NODES.END),
            Dialogue(NODES.AFTER, scene, mermaid, t["after"], NODES.END)
        );
        return NPCPrefab(scene, interact)(mermaid);
    };
}