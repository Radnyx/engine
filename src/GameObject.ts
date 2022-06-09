import { AbstractEntity, Component } from "@trixt0r/ecs";

type Prefab = (obj: GameObject) => GameObject;

function compose(...prefabs: Prefab[]): Prefab {
    return (obj: GameObject) => {
        for (const prefab of prefabs) {
            obj = prefab(obj);
        }
        return obj;
    };
}

class GameObject extends AbstractEntity {
    private static id: number = 0;
    constructor(tag: string | undefined = undefined) {
        super(tag || GameObject.id++);
    }
}

export { GameObject as default, Prefab, compose }