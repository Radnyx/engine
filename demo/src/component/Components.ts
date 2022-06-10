import { Component } from "@trixt0r/ecs";
import FSMGraph from "../FSMGraph";
import { Item, ITEM_NAMES } from "../Item";

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
    constructor(
        public controllable: boolean = true, 
        // TODO: move this to PlayerInventory object that persists between scenes?
        // or, Game has overall state attached to it
        private _currentItem: number = 0,
        private _items: Item[] = [ Item.NOTHING ]
    ) {}

    giveItem(item: Item) {
        console.log("received " + ITEM_NAMES[item]);
        this._items.push(item);
        this._currentItem = this._items.length - 1;
    }
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
        if (node != FSMGraph.NULL_NODE) {
            const { enter } = graph.get(node);
            if (enter) {
                this._exit = enter(this);
            }
        }
    }

    execute(node: number) {
        this.start(this._graph, node);
    }
}

export { WalkToComponent, PlayerComponent, FSMComponent };