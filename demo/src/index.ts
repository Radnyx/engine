import { Game, GameObject, Scene, SpriteComponent, 
    SpriteSystem, PhysicsSystem } from "../../src/index";
import { Rectangle } from "pixi.js";
import Input from "./Input";
import PlayerSystem from "./system/PlayerSystem";
import WalkToSystem from "./system/WalkToSystem";
import { PlayerComponent } from "./component/Components";
import CharacterPrefab from "./prefab/CharacterPrefab";
import { clickStageMessage } from "./Messages";
import { compose } from "../../src/GameObject";
import PoetPrefab from "./prefab/PoetPrefab";
import FSMSystem from "./system/FSMSystem";

class DemoScene extends Scene {
    override onLoad(game: Game): void {
        super.onLoad(game);

        this.stage.interactive = true;
        this.stage.hitArea = new Rectangle(0, 0, 640, 360);
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

        const player = CharacterPrefab(this, 220, 180, 25, 25)(new GameObject("player"));
        player.components.add(new PlayerComponent());

        const poet = compose(
            CharacterPrefab(this, 400, 90, 25, 25),
            PoetPrefab(this)
        )(new GameObject());
        
        this.ecs.entities.add(player, poet);
    }
}

function init() {
    const game = new Game(640, 360);
    game.loadScene(new DemoScene());
    game.start();

    document.addEventListener("keydown", Input.keyDown);
    document.addEventListener("keyup", Input.keyUp);
    document.getElementById("app").appendChild(game.app.view);
}

init();