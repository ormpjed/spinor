export default class DialView {
    element;
    _lines = [];
    _lineThickness;
    _lineLength;

    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'dial-circle';

        for (let _ = 0; _ < 2; _++) {
            const line = document.createElement('div');
            line.className = 'dial-line';
            this._lines.push(line);
        }

        this._lines[0].style['border-color'] = 'red';
        this._lines[1].style['border-color'] = 'blue';

        this.element.append(...this._lines);
    }

    update(spin) {
        for (let i = 0; i < 2; i++) {
            this._lines[i].style.width = `calc(var(--dial-radius) * ${spin[i].norm()} - var(--dial-thickness) / 2`;
            this._lines[i].style.transform = `rotate(${spin[i].arg()}rad)`;
        }
    }
}