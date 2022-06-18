import GameObject, { Prefab } from "../../../src/GameObject";
import FSMGraph from "../FSMGraph";
import { Item } from "../Item";
import { Condition, Dialogue, Do, Select } from "../States";
import NPCPrefab from "./NPCPrefab";
import * as text from "../../build/assets/text.json";
import AdventureScene from "../scene/AdventureScene";

enum NODES {
    CHOOSE_PATH = 0,
    END,
    INTRO,
    SELECT_INTRO,
    HOW_TO_PLAY = 10,
    HOW_CHAMPION = 20,
    LETS_PLAY = 30,
    BYE = 40,
    WON = 50,
    SELECT_WON = 60,
    TRADE = 70,
    STAY_CHAMP = 80,
    LOST = 90,
    GET_ROCK = 100
}

export default function LadyPrefab(scene: AdventureScene): Prefab {
    const t = text["champion"];
    return (champ: GameObject) => {
        const interact = new FSMGraph(
            Condition(NODES.CHOOSE_PATH, [
                {
                    when: () => true,
                    node: NODES.INTRO
                }
            ]),
            Do(NODES.END, () => {
                scene.playerComponent.controllable = true;
            }, FSMGraph.NULL_NODE),
            Dialogue(NODES.INTRO, scene, champ, t["intro"]),
            Select(NODES.SELECT_INTRO, scene, t["select_intro"], [
                NODES.HOW_TO_PLAY,
                NODES.HOW_CHAMPION,
                { node: NODES.LETS_PLAY, when: () => !scene.playerComponent.holding(Item.NOTHING) },
                NODES.BYE
            ]),
            Dialogue(NODES.HOW_TO_PLAY, scene, champ, t["how_to_play"], NODES.SELECT_INTRO),
            Dialogue(NODES.HOW_CHAMPION, scene, champ, t["how_champion"], NODES.SELECT_INTRO),
            Dialogue(NODES.BYE, scene, champ, t["bye"], NODES.END),
            Condition(NODES.LETS_PLAY, [
                {
                    when: () => scene.playerComponent.holding(Item.LETTER),
                    node: NODES.WON
                },
                { node: NODES.LOST }
            ]),
            Dialogue(NODES.WON, scene, champ, t["won"], NODES.SELECT_WON),
            Select(NODES.SELECT_WON, scene, t["select_won"], [
                NODES.TRADE,
                NODES.STAY_CHAMP
            ]),
            Dialogue(NODES.TRADE, scene, champ, t["trade"], NODES.GET_ROCK),
            Do(NODES.GET_ROCK, () => {
                scene.playerComponent.giveItem(Item.ROCK);
            }, NODES.END),
            Dialogue(NODES.STAY_CHAMP, scene, champ, t["stay_champ"], NODES.SELECT_WON),
            Dialogue(NODES.LOST, scene, champ, t["lost"], NODES.END)
        );
        return NPCPrefab(scene, interact)(champ);
    };
}