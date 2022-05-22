import { AbstractEntity } from "@trixt0r/ecs";

export default class GameObject extends AbstractEntity {
    private static id: number = 0;
    constructor() {
        super(GameObject.id++);
    }
}