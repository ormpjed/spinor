import { Complex, spinToEuclideanVector } from "./math.mjs";
import VectorView from "./vector-view.mjs";

class Stage {

}

export default class Tutorial {
    _element;
    _matrixView;
    _gauge1;
    _gauge2;

    constructor() {
        this._element = document.createElement('div');
        this._gauge1 = document.createElement('progress');
        this._gauge2 = document.createElement('progress');
        this._matrixView = new VectorView(3, 'real');
        this._element.append(this._gauge1, this._gauge2, this._matrixView.element);
    }

    get element() {
        return this._element;
    }

    target = [
        new Complex(1, 0),
        new Complex(0, 0)
    ];
    t2 = [0, 0, 1];
    update(spin) {
        this._gauge1.setAttribute('value', this._errorAsRealVector(spin, this.target));
        this._gauge2.setAttribute('value', this._errorAsEuclideanVector(spin, this.t2));
        const v3 = spinToEuclideanVector(spin);
        this._matrixView.update(v3);
    }

    _errorAsRealVector(a, b) {
        return 1 - Math.acos(
            a[0].real * b[0].real +
            a[0].imag * b[0].imag +
            a[1].real * b[1].real +
            a[1].imag * b[1].imag
        ) / Math.PI;
    }

    _errorAsEuclideanVector(a, b) {
        const ev = spinToEuclideanVector(a);
        return 1 - Math.acos(
            this.t2[0] * ev[0] +
            this.t2[1] * ev[1] +
            this.t2[2] * ev[2]
        ) / Math.PI;
    }
}