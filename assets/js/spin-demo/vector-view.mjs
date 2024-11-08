export default class VectorView {
    _element;

    constructor() {
        this._element = document.createElement('div');
    }

    get element() {
        return this._element;
    }

    update(spin) {
        this._element.innerText = this._formatSpin(spin);
    }

    _formatSpin(spin) {
        return `
    [${spin[0].real}+${spin[0].imag}i]
    [${spin[1].real}+${spin[1].imag}i]
    `;
    }
}