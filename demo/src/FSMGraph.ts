
interface Edge {
    id: number;
    condition: () => boolean;
}

interface Node {
    id: number;
    // first called when entering node
    // return value is called when exiting
    enter: () => ((() => void) | void);
    edges?: Edge[];
}

class FSMGraph {
    public static NULL_NODE: number = -1;
    private nodeMap: Map<number, Node>;
    constructor(...nodes: Node[]) {
        this.nodeMap = new Map();
        for (const node of nodes) {
            this.nodeMap.set(node.id, node);
        }
    }
    
    get(id: number) {
        return this.nodeMap.get(id);
    }
}

export { Edge, Node, FSMGraph as default };