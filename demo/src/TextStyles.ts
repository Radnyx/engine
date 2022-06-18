import { TextStyle } from "pixi.js";

const DIALOGUE_WIDTH = 500;

export default {
    DIALOGUE: new TextStyle({
        fontSize: 14,
        align: "center",
        fill: "#fbff00",
        fontFamily: "Verdana, Geneva, sans-serif",
        lineJoin: "bevel",
        strokeThickness: 4,
        wordWrap: true,
        wordWrapWidth: DIALOGUE_WIDTH,
        fontWeight: "bold"
    }),
    OPTION: new TextStyle({
        fontSize: 14,
        align: "left",
        fill: "white",
        fontFamily: "Verdana, Geneva, sans-serif",
        lineJoin: "bevel",
        strokeThickness: 4,
        fontWeight: "bold"
    }),
    HOVER_OPTION: new TextStyle({
        fontSize: 14,
        align: "left",
        fill: "#fbff00",
        fontFamily: "Verdana, Geneva, sans-serif",
        lineJoin: "bevel",
        strokeThickness: 4,
        fontWeight: "bold"
    })
};