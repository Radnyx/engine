import { GameObject, Scene, SpriteComponent } from "../../../src";
import { Prefab } from "../../../src/GameObject";
import { FSMComponent, WalkToComponent } from "../component/Components";
import FSMGraph from "../FSMGraph";

export default function NPCPrefab(scene: Scene, graph?: FSMGraph): Prefab {
    return (obj: GameObject) => {
        const fsm = new FSMComponent();
        obj.components.add(fsm);
        // Walk player to character
        obj.components.get(SpriteComponent).sprite.on("click", e => {
            e.stopPropagation();
            scene.ecs.entities.get("player").components.get(WalkToComponent).walkTo(
                e.data.global.x, 
                e.data.global.y,
                10,
                36,
                () => fsm.start(graph)
            );
        });
        return obj;
    };
}