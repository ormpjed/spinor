import { Complex, Quaternion } from "./math.mjs";
import VectorView from "./vector-view.mjs";

const rotation = new Quaternion([1 / Math.SQRT2, 0, 0, -1 / Math.SQRT2]);

export default class SpinApp {
    _sensor;
    _orientation = new Quaternion([1, 0, 0, 0]);

    _element;
    _vectorView;

    constructor(sensor) {
        this._sensor = sensor;

        this._element = document.createElement('div');
        this._vectorView = new VectorView();
        this._element.appendChild(this._vectorView.element);

        this._sensor.onreading = () => this._update();
        this._sensor.start();
    }

    get element() {
        return this._element;
    }

    _update() {
        let reading = new Quaternion(this._sensor.quaternion);

        this._orientation = this._orientation.dot(reading) >= 0 ?
            reading : reading.scaled(-1);

        const spin = this._orientationToSpin(this._orientation);
        this._vectorView.update(spin);
    }

    _orientationToSpin(quaternion) {
        const orientation = rotation.times(quaternion);
        return [
            new Complex(orientation.w, orientation.x),
            new Complex(-orientation.y, orientation.z),
        ];
    }
}