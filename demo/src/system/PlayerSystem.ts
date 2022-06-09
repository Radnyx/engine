import { AbstractEntitySystem } from "@trixt0r/ecs";
import { GameObject, Scene } from "../../../src";
import { PlayerComponent, WalkToComponent } from "../component/Components";
import { clickStageMessage } from "../Messages";

export default class PlayerSystem extends AbstractEntitySystem<GameObject> {
    constructor(private scene: Scene) {
        super(undefined, [PlayerComponent, WalkToComponent]);
    }

    override onAddedEntities(object: GameObject): void {
        const data = object.components.get(PlayerComponent);
        const walkTo = object.components.get(WalkToComponent);
        this.scene.bus.subscribe(clickStageMessage, ({ payload: { x, y } }) => {
            if (!data.inDialogue) {
                walkTo.walkTo(x, y, 10);
            }
        });
    }

    override processEntity(gameObject: GameObject): void {}
}