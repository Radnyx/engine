import { Scene } from "../../../src";
import GameObject, { Prefab } from "../../../src/GameObject";
import { FSMComponent, PlayerComponent } from "../component/Components";
import FSMGraph from "../FSMGraph";
import { clickStageMessage } from "../Messages";
import NPCPrefab from "./NPCPrefab";

enum NODES {
    DIALOGUE_FIRST = 0,
    SELECT_OPINION
}

export default function PoetPrefab(scene: Scene): Prefab {
    return (poet: GameObject) => {
        const interactWithPoet = new FSMGraph(
            {
                id: NODES.DIALOGUE_FIRST, 
                enter: () => {
                    scene.ecs.entities.get("player").components.get(PlayerComponent).inDialogue = true;
                    /// TODO:
                    console.log("ADD TEXT CHILD OBJECT");
                    const unsubscribe = scene.bus.subscribe(clickStageMessage, () => {
                        poet.components.get(FSMComponent).execute(NODES.SELECT_OPINION);
                    });
                    // exit
                    return () => {
                        /// TODO:
                        console.log("REMOVE TEXT CHILD OBJECT");
                        unsubscribe();
                    };
                }
            },
            {
                id: NODES.SELECT_OPINION,
                enter: () => {
                    /// TODO:
                    console.log("SELECT OPINION OBJECTS");
                }
            }
        );

        return NPCPrefab(scene, interactWithPoet)(poet);
    };
}