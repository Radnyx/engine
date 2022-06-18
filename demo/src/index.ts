import { Game } from "../../src/index";
import Input from "./Input";
import HarborScene from "./scene/HarborScene";
import { DISPLAY_HEIGHT, DISPLAY_WIDTH } from "./Constants";

function init() {
    const game = new Game(DISPLAY_WIDTH, DISPLAY_HEIGHT);
    game.loadScene(new HarborScene());
    game.start();

    document.addEventListener("keydown", Input.keyDown);
    document.addEventListener("keyup", Input.keyUp);
    document.getElementById("app").appendChild(game.app.view);
}

init();