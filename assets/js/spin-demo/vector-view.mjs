function _round(x) {
    return x.toFixed(2);
}

const zeroRounded = _round(0);

function _formatReal(x, positivePrefix = '\u00a0', negativePrefix = '-') {
    const magnitude = _round(Math.abs(x));
    if (magnitude === zeroRounded) {
       return positivePrefix + zeroRounded; 
    } else if (x > 0) {
        return positivePrefix + magnitude;
    } else {
        return negativePrefix + magnitude;
    }
}

function _formatComplex(z) {
    return _formatReal(z.real) + _formatReal(z.imag, ' + ', ' - ') + 'i';
}

export default class VectorView {
    element;
    _type;

    constructor(size, type) {
        this._type = type;
        this.element = document.createElement('span');
        this.element.classList.add('vector');
        for (let _ = 0; _ < size; _++) {
            this.element.append(document.createElement('div'));
        }
    }

    update(vector) {
        for (let i = 0; i < vector.length; i++) {
            this.element.children[i].innerHTML = this._format(vector[i]);
        }
    }

    setColors(...colors) {
        for (let i = 0; i < colors.length; i++) {
            this.element.children[i].style.color = colors[i];
        }
    }

    _format(x) {
        if (this._type === 'real') {
            return _formatReal(x) + '\u00a0';
        } else if (this._type === 'complex') {
            return _formatComplex(x) + '\u00a0';
        } else {
            return x;
        }
    }
}