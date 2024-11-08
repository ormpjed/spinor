export default class MockSensor {
    frequency;
    interval;
    onreading = () => {};

    constructor({frequency=60} = {}) {
        this.frequency = frequency;
    }

    start() {
        this.interval = setInterval(() => {
            this.quaternion = [Math.random(), 0, 0, 0];
            this.onreading();
        }, 1000 / this.frequency);
    }

    stop() {
        clearInterval(this.interval);
    }
}