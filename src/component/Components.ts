import { Component } from "@trixt0r/ecs";
import { Container, Sprite } from "pixi.js";
import { Body } from "matter-js";

class TransformComponent implements Component {
    constructor(public x: number = 0, public y: number = 0, public angle: number = 0) {}
}

class StageComponent implements Component {
    constructor(public stage: Container) {}
}

class SpriteComponent implements Component {
    constructor(public sprite: Sprite) {}
}

class PhysicsComponent implements Component {
    constructor(public world: Matter.World, public body: Body) {}
}

export { TransformComponent, StageComponent, SpriteComponent, PhysicsComponent };