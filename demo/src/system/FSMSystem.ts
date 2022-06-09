import { AbstractEntitySystem } from "@trixt0r/ecs";
import { GameObject } from "../../../src";
import { FSMComponent } from "../component/Components";
import FSMGraph from "../FSMGraph";

export default class FSMSystem extends AbstractEntitySystem<GameObject> {
    constructor() {
        super(undefined, [FSMComponent]);
    }

    override processEntity(gameObject: GameObject): void {
        const fsm = gameObject.components.get(FSMComponent);
        if (fsm.graph == null || fsm.node == FSMGraph.NULL_NODE) {
            return;
        }
        const edges = fsm.graph.get(fsm.node).edges;
        if (edges != null) {
            for (const edge of edges) {
                if (edge.condition()) {
                    fsm.execute(edge.id);
                }
            }
        }
    }
}