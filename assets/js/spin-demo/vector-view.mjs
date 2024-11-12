export default class VectorView {
    _element;
    _type;

    constructor(size, type) {
        this._type = type;
        this._element = document.createElement('div');
        this._element.classList.add('vector');
        for (let _ = 0; _ < size; _++) {
            this._element.append(document.createElement('div'));
        }
    }

    get element() {
        return this._element;
    }

    update(vector) {
        for (let i = 0; i < vector.length; i++) {
            this._element.children[i].innerHTML = this._format(vector[i]);
        }
    }

    _format(x) {
        if (this._type === 'real') {
            return this._formatReal(x);
        } else if (this._type === 'complex') {
            return this._formatComplex(x);
        } else {
            return x;
        }
    }

    _round(x) {
        return x.toFixed(2);
    }

    _formatPrefixSpaceIfPositive(x) {
        return (x >= 0 ? '\u00A0' : '') + this._round(x);
    }

    _formatSignToOperator(x) {
        return x >= 0 ?
            ' + ' + this._round(x) :
            ' - ' + this._round(-x);
    }

    _formatReal(x) {
        return this._formatPrefixSpaceIfPositive(x) + '\u00A0';
    }

    _formatComplex(z) {
        return this._formatPrefixSpaceIfPositive(z.real) + this._formatSignToOperator(z.imag) + 'i\u00A0';
    }
}