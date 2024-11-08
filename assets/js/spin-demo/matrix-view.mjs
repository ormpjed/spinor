export default class MatrixView {
    _element;
    _mtable;

    constructor(height, width, type) {
        this._element = document.createElementNS('http://www.w3.org/1998/Math/MathML','math');
        this._element.setAttribute('display', 'block');
        this._element.innerHTML = `
<mrow>
<mo>[</mo>
<mtable>
${`<mtr>${`<mtd><${type}>0</${type}></mtd>`.repeat(width)}</mtr>`.repeat(height)}</mtable>
<mo>]</mo>
</mrow>
`;
        this._mtable = this._element.children[0].children[1];
    }

    get element() {
        return this._element;
    }

    update(matrix) {
        for (let i = 0; i < matrix.length; i++) {
            const mtr = this._mtable.children[i];
            for (let j = 0; j < matrix[i].length; j++) {
                const mtd = mtr.children[j];
                const mn = mtd.firstElementChild;
                mn.innerHTML = matrix[i][j];
            }
        }
    }
}