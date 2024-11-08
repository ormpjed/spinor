export default class VectorView {
    _element;

    constructor() {
        this._element = document.createElement('div');
    }

    get element() {
        return this._element;
    }

    update(spin) {
        this._element.innerText = spin.map(z => this._formatComplex(z)).join('\n');
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