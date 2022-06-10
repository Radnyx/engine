import { Component } from "@trixt0r/ecs";
import FSMGraph from "../FSMGraph";

class WalkToComponent implements Component {
    constructor(
        public position: { x: number, y: number } | undefined = undefined,
        public speed: number | undefined = undefined,
        public radius: number | undefined = undefined,
        public done: (() => void) | undefined = undefined
    ) {}

    walkTo(x: number, y: number, speed: number, radius?: number, done?: () => void) {
        this.position = { x, y };
        this.speed = speed;
        this.radius = radius;
        this.done = done;
    }
}

class PlayerComponent implements Component {
    constructor(public controllable: boolean = true) {}
}

class FSMComponent implements Component {
    constructor(
        private _graph: FSMGraph = null, 
        private _node: number = FSMGraph.NULL_NODE,
        private _exit: ((() => void) | void) = undefined
    ) {}

    get graph() { return this._graph; }

    get node() { return this._node; }

    start(graph: FSMGraph, node: number = 0) {
        if (this._exit) {
            this._exit();
        }
        this._graph = graph;
        this._node = node;
        this._exit = graph.get(node).enter(this);
    }

    execute(node: number) {
        this.start(this._graph, node);
    }
}

export { WalkToComponent, PlayerComponent, FSMComponent };