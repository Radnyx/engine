import { FSMComponent } from "./component/Components";

interface Edge {
    id: number;
    condition: () => boolean;
}

interface Node {
    id: number;
    // first called when entering node
    // return value is called when exiting
    enter?: (fsm: FSMComponent) => ((() => void) | void);
    // executed each frame
    run?: (fsm: FSMComponent) => void;
}

class FSMGraph {
    public static NULL_NODE: number = -1;
    private nodeMap: Map<number, Node>;
    constructor(...nodes: (Node | Node[])[]) {
        this.nodeMap = new Map();
        for (const node of nodes) {
            if (Array.isArray(node)) {
                for (const n of node) {    
                    this.addNode(n);
                }
            } else {
               this.addNode(node);
            }
        }
    }
    
    get(id: number) {
        return this.nodeMap.get(id);
    }

    private addNode(node: Node) {
        if (this.nodeMap.has(node.id)) {
            throw new Error(`FSMGraph already has node: ${node.id}`);
        }
        this.nodeMap.set(node.id, node);
    }
}

export { Edge, Node, FSMGraph as default };