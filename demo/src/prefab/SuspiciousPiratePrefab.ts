import GameObject, { compose, Prefab } from "../../../src/GameObject";
import FSMGraph from "../FSMGraph";
import { Item } from "../Item";
import { Condition, Dialogue, Do, Select } from "../Nodes";
import * as text from "../../build/assets/text.json";
import AdventureScene from "../scene/AdventureScene";
import NPCPrefab from "./NPCPrefab";
import { SuspiciousPirateComponent, WalkToComponent } from "../component/Components";
import CharacterPrefab from "./CharacterPrefab";
import CatPrefab from "./CatPrefab";

enum NODES {
    CHOOSE_PATH = 0,
    END = 1,
    CHECK_ASKED_QUESTIONS = 2,
    INTRO = 10,
    SELECT_INTRO = 20,
    ARE_YOU_A_PIRATE = 30,
    WHAT_ARE_YOU_DOING = 40,
    HAVE_YOU_HEARD = 50,
    END_QUESTIONS = 60,
    SHOW_CAT = 70,
    CAT = 80,
    AFTER = 90,
    ATTACK = 100,
    GIVE_CAT = 110,
    ATTACK_DISTRACTED = 120
}

export default function SuspiciousPiratePrefab(scene: AdventureScene): Prefab {
    const t = text["suspicious_pirate"];
    return (pirate: GameObject) => {
        const pirateComponent = new SuspiciousPirateComponent();
        pirate.components.add(pirateComponent)
        const interact = new FSMGraph(
            Condition(NODES.CHOOSE_PATH, [
                {
                    when: () => pirateComponent.state.distracted && 
                        scene.playerComponent.holding(Item.ROCK),
                    node: NODES.ATTACK_DISTRACTED
                },
                {
                    when: () => scene.playerComponent.holding(Item.ROCK),
                    node: NODES.ATTACK
                },
                {
                    when: () => scene.playerComponent.holding(Item.CAT),
                    node: NODES.GIVE_CAT
                },
                {
                    when: () => scene.playerComponent.gameState.metPirate,
                    node: NODES.AFTER
                },
                { node: NODES.INTRO }
            ]),
            Do(NODES.END, () => {
                scene.playerComponent.gameState.metPirate = true;
                scene.playerComponent.controllable = true;
            }, FSMGraph.NULL_NODE),
            Dialogue(NODES.INTRO, scene, pirate, t["intro"], NODES.CHECK_ASKED_QUESTIONS),
            Condition(NODES.CHECK_ASKED_QUESTIONS, [
                { 
                    when: () => pirateComponent.state.asked.every(x => x), 
                    node: NODES.END_QUESTIONS 
                },
                { node: NODES.SELECT_INTRO }
            ]),
            Select(NODES.SELECT_INTRO, scene, t["select_intro"], [
                { when: () => !pirateComponent.state.asked[0], node: NODES.ARE_YOU_A_PIRATE },
                { when: () => !pirateComponent.state.asked[1], node: NODES.WHAT_ARE_YOU_DOING },
                { when: () => !pirateComponent.state.asked[2], node: NODES.HAVE_YOU_HEARD }
            ]),
            Dialogue(NODES.ARE_YOU_A_PIRATE, scene, pirate, t["are_you_a_pirate"], NODES.CHECK_ASKED_QUESTIONS,
                () => pirateComponent.state.asked[0] = true),
            Dialogue(NODES.WHAT_ARE_YOU_DOING, scene, pirate, t["what_are_you_doing"], NODES.CHECK_ASKED_QUESTIONS,
                () => pirateComponent.state.asked[1] = true),
            Dialogue(NODES.HAVE_YOU_HEARD, scene, pirate, t["have_you_heard"], NODES.CHECK_ASKED_QUESTIONS,
                () => pirateComponent.state.asked[2] = true),
            Dialogue(NODES.END_QUESTIONS, scene, pirate, t["end_questions"], NODES.SHOW_CAT),
            Do(NODES.SHOW_CAT, () => {
                const cat = compose(
                    CharacterPrefab(scene, 832, 162, 35, 35, 0xFF8000),
                    CatPrefab(scene)
                )(new GameObject());
                cat.components.get(WalkToComponent).walkTo(800, 276, 2);
                scene.ecs.entities.add(cat);
            }, NODES.CAT),
            Dialogue(NODES.CAT, scene, pirate, t["cat"], NODES.END),
            Dialogue(NODES.AFTER, scene, pirate, t["after"], NODES.END),
            Dialogue(NODES.ATTACK, scene, pirate, t["attack"], NODES.END),

            Dialogue(NODES.GIVE_CAT, scene, pirate, t["give_cat"], NODES.END, () => {
                pirateComponent.state.distracted = true;
            }),

            Do(NODES.ATTACK_DISTRACTED, () => {
                console.log("you win");
            }, NODES.END)
        );
        return NPCPrefab(scene, interact)(pirate);
    };
}