import { Rectangle } from "pixi.js";
import { Game, GameObject, PhysicsSystem, Scene, SpriteSystem } from "../../../src";

import { clickStageMessage } from "../Messages";
import { DISPLAY_HEIGHT, DISPLAY_WIDTH } from "../Constants";
import PlayerSystem from "../system/PlayerSystem";
import WalkToSystem from "../system/WalkToSystem";
import FSMSystem from "../system/FSMSystem";
import { PlayerComponent } from "../component/Components";

export default class AdventureScene extends Scene {

    override async onLoad(game: Game) {
        await super.onLoad(game);

        this.stage.interactive = true;
        this.stage.hitArea = new Rectangle(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);
        this.stage.on("click", e => this.bus.publish(
            clickStageMessage({
                x: e.data.global.x, 
                y: e.data.global.y,
            })
        ));
        
        this.physics.gravity.y = 0;

        this.ecs.systems.add(
            new SpriteSystem(), 
            new PhysicsSystem(), 
            new PlayerSystem(this),
            new WalkToSystem(),
            new FSMSystem()
        );
    }

    get player(): GameObject {
        return this.ecs.entities.get("player");
    }

    get playerComponent(): PlayerComponent {
        return this.player.components.get(PlayerComponent);
    }

    get width(): number {
        return DISPLAY_WIDTH;
    }

    get height(): number {
        return DISPLAY_HEIGHT;
    }
}