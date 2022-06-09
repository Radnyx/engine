import { createEventDefinition } from "ts-bus";

const clickStageMessage = createEventDefinition<
    { x: number, y: number }
>()("clickStage");

export { clickStageMessage };