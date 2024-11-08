import MatrixView from "./matrix-view.mjs";

export default class VectorView {
    _matrixView;

    constructor() {
        this._matrixView = new MatrixView(2, 1, 'mn');
    }

    get element() {
        return this._matrixView.element;
    }

    update(spin) {
      this._matrixView.update([
        [this._formatComplex(spin[0])],
        [this._formatComplex(spin[1])],
      ])
    }

    _formatReal(x) {
        const magnitude = Math.abs(x).toFixed(1);
        return {
            sign: (x > 0 || magnitude === "0.0") ? '+' : '-',
            magnitude
        };
    }

    _formatComplex(z) {
        const z0 = this._formatReal(z.real);
        const z1 = this._formatReal(z.imag);
        return `${z0.sign.replace('+', '\u00A0')}${z0.magnitude} ${z1.sign} ${z1.magnitude}i`;
    }
}