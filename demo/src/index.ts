import { Game, GameObject, PhysicsComponent, Scene, SpriteComponent, 
    SpriteSystem, StageComponent, TransformComponent, PhysicsSystem } from "../../src/index";
import { AbstractEntitySystem, Component } from "@trixt0r/ecs";
import { Texture, Sprite, Rectangle } from "pixi.js";
import Input from "./Input";
import Matter from "matter-js";
import { createEventDefinition } from "ts-bus";
import PlayerSystem from "./system/PlayerSystem";
import WalkToSystem from "./system/WalkToSystem";
import { PlayerComponent, WalkToComponent } from "./component/Components";
import CharacterPrefab from "./prefab/CharacterPrefab";

const walkToEvent = createEventDefinition<
    { object: GameObject, x: number, y: number, speed: number }
>()("walkTo");

class DemoScene extends Scene {
    override onLoad(game: Game): void {
        super.onLoad(game);

        this.physics.gravity.y = 0;

        this.ecs.systems.add(
            new SpriteSystem(), 
            new PhysicsSystem(), 
            new PlayerSystem(),
            new WalkToSystem()
        );
        
        const player = CharacterPrefab(this, 220, 180, 25, 25);
        player.components.add(new PlayerComponent());
        this.ecs.entities.add(player);

        this.stage.interactive = true;
        this.stage.hitArea = new Rectangle(0, 0, 640, 360);
        this.stage.on("click", e => {
            this.eventBus.publish(walkToEvent({ 
                object: player, 
                x: e.data.global.x, 
                y: e.data.global.y, 
                speed: 10
            }));
        });
        
        this.eventBus.subscribe(walkToEvent, event => {
            const { object, x, y, speed } = event.payload;
            const walkTo = object.components.get(WalkToComponent);
            walkTo.position = { x, y };
            walkTo.speed = speed;
        });
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