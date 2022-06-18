import AdventureScene from "./AdventureScene";

import CharacterPrefab from "../prefab/CharacterPrefab";
import PoetPrefab from "../prefab/PoetPrefab";
import LadyPrefab from "../prefab/LadyPrefab";
import ChampionPrefab from "../prefab/ChampionPrefab";
import MermaidPrefab from "../prefab/MermaidPrefab";
import { Game, GameObject, SpriteComponent, StageComponent, TransformComponent } from "../../../src";
import { PlayerComponent } from "../component/Components";
import { compose } from "../../../src/GameObject";
import SuspiciousPiratePrefab from "../prefab/SuspiciousPiratePrefab";
import { Sprite } from "pixi.js";
import FishPrefab from "../prefab/FishPrefab";

export default class HarborScene extends AdventureScene {

    constructor() {
        super([
            "assets/harbor.png"
        ]);
    }

    override async onLoad(game: Game) {
        await super.onLoad(game);

        const player = CharacterPrefab(this, 220, 180, 50, 50)(new GameObject("player"));
        player.components.add(new PlayerComponent());

        const poet = compose(
            CharacterPrefab(this, 590, 248, 50, 50, 0xC09020),
            PoetPrefab(this)
        )(new GameObject());

        const lady = compose(
            CharacterPrefab(this, 154, 298, 50, 50, 0xE01040),
            LadyPrefab(this)
        )(new GameObject());

        const champ = compose(
            CharacterPrefab(this, 364, 144, 50, 50, 0x1040C0),
            ChampionPrefab(this)
        )(new GameObject());

        const mermaid = compose(
            CharacterPrefab(this, 808, 470, 50, 50, 0x20D090),
            MermaidPrefab(this)
        )(new GameObject());

        const suspiciousPirate = compose(
            CharacterPrefab(this, 754, 140, 50, 50, 0xFF0000),
            SuspiciousPiratePrefab(this)
        )(new GameObject());

        const fish = compose(
            CharacterPrefab(this, 390, 526, 50, 50, 0x0000FF),
            FishPrefab(this)
        )(new GameObject());

        const harborBackground = new GameObject();
        harborBackground.components.add(new StageComponent(this.stage));
        harborBackground.components.add(new SpriteComponent(new Sprite(
            this.loader.resources["assets/harbor.png"].texture
        )));
        harborBackground.components.add(new TransformComponent(0, 0));
        
        this.ecs.entities.add(
            harborBackground, 
            player, 
            poet, 
            lady,
            champ, 
            mermaid, 
            suspiciousPirate,
            fish
        );
    }
}
