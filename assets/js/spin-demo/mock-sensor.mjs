export default class MockSensor {
    _frameId;
    onreading = () => {};

    start() {
        this._frameId = requestAnimationFrame((time) => this._frame(time));
    }

    stop() {
        cancelAnimationFrame(this._frameId);
    }

    _frame(time) {
        const phase = time / 2000;
        this.quaternion = [Math.cos(phase), 0, 0, Math.sin(phase)];
        this.onreading();
        this._frameId = requestAnimationFrame((time) => this._frame(time));
    }
}