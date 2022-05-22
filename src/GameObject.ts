import { AbstractEntity } from "@trixt0r/ecs";

export class GameObject extends AbstractEntity {
    private static id: number = 0;
    constructor() {
        super(GameObject.id++);
    }
}