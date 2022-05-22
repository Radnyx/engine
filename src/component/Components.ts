import { Component } from "@trixt0r/ecs";
import { Container, Sprite } from "pixi.js";

class TransformComponent implements Component {
    constructor(public x: number = 0, public y: number = 0) {}
}

class StageComponent implements Component {
    constructor(public stage: Container) {}
}

class SpriteComponent implements Component {
    constructor(public sprite: Sprite) {}
}

export { TransformComponent, StageComponent, SpriteComponent };