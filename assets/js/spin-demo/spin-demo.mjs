import { Complex, Quaternion } from "./math.mjs";
import Tutorial from "./tutorial.mjs";
import VectorView from "./vector-view.mjs";

export default class SpinDemo {
    _sensor;
    _orientation = new Quaternion([0, 0, 0, 1]);

    _element;
    _children = [];

    constructor(sensor) {
        this._sensor = sensor;

        this._element = document.createElement('div');
        const top = document.createElement('div');
        const bottom = document.createElement('div');
        top.classList.add('top');
        bottom.classList.add('bottom');
        this._element.append(top, bottom);

        const vectorView = new VectorView(2, 'complex');
        top.append(vectorView.element);
        const tutorial = new Tutorial();
        bottom.append(tutorial.element);

        this._children.push(vectorView, tutorial);

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
        this._children.forEach(c => c.update(spin));
    }

    R = [
        [new Complex(1 / Math.SQRT2, 0), new Complex(1 / Math.SQRT2, 0)],
        [new Complex(0, 1 / Math.SQRT2), new Complex(0, -1 / Math.SQRT2)],
    ]

    _orientationToSpin(orientation) {
        const reposition = new Quaternion([-1, 0, 0, 1]).scaled(1 / Math.SQRT2);
        const r = orientation.times(reposition)

        return [
            new Complex(r.w, -r.z),
            new Complex(r.y, -r.x),
        ];
    }
}