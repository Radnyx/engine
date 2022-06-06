import { Component } from "@trixt0r/ecs";

class WalkToComponent implements Component {
    constructor(
        public position: { x: number, y: number } | undefined = undefined,
        public speed: number | undefined = undefined
    ) {}
}

class PlayerComponent implements Component {
    constructor() {}
}

export { WalkToComponent, PlayerComponent };