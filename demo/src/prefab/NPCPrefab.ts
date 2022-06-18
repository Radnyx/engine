import { GameObject, SpriteComponent } from "../../../src";
import { Prefab } from "../../../src/GameObject";
import { FSMComponent, PlayerComponent, WalkToComponent } from "../component/Components";
import FSMGraph from "../FSMGraph";
import AdventureScene from "../scene/AdventureScene";

export default function NPCPrefab(scene: AdventureScene, graph?: FSMGraph): Prefab {
    return (obj: GameObject) => {
        const fsm = new FSMComponent();
        obj.components.add(fsm);
        // Walk player to character
        obj.components.get(SpriteComponent).sprite.on("click", e => {
            if (!scene.playerComponent.controllable) {
                return;
            }
            e.stopPropagation();
            scene.player.components.get(WalkToComponent).walkTo(
                e.data.global.x, 
                e.data.global.y,
                10,
                75,
                () => graph && fsm.start(graph)
            );
        });
        return obj;
    };
}