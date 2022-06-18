export default {
    clamp: (x: number, low: number, high: number) => {
        return Math.max(Math.min(x, high), low);
    }
};