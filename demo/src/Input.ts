namespace Input {
    let input = {};

    export function keyDown(key) {
        input[key.code] = true;
    }

    export function keyUp(key) {
        input[key.code] = false;
    }

    export function isPressed(key) {
        return input[key];
    }
}

export default Input;