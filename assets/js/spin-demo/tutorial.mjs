import { Complex, spinToEuclideanVector } from "./math.mjs";
import VectorView from "./vector-view.mjs";

function complexVectorError(p, q) {
    return 1 - Math.acos(
        p[0].real * q[0].real +
        p[0].imag * q[0].imag +
        p[1].real * q[1].real +
        p[1].imag * q[1].imag
    ) / Math.PI;
}

function realVectorError(v, w) {
    return 1 - Math.acos(
        v[0] * w[0] +
        v[1] * w[1] +
        v[2] * w[2]
    ) / Math.PI;
}

class Stage {
    element;

    constructor(description) {
        this.element = document.createElement('div');
        const content = document.createElement('div');
        content.innerHTML = description;
        this.element.append(content);
    }

    update() { }
}

class StageWithGoal extends Stage {
    progressFunction;
    threshold;
    _progress;
    _complete;

    constructor(description, target, comparison) {
        super(description);

        if (comparison === 'vector') {
            this.progressFunction = (spin) => complexVectorError(spin, target);
            this.threshold = 0.96;
        } else if (comparison === 'state') {
            const targetDirection = spinToEuclideanVector(target);
            this.progressFunction = (spin) => realVectorError(spinToEuclideanVector(spin), targetDirection);
            this.threshold = 0.97;
        }

        const goal = document.createElement('div');
        goal.className = 'objective';
        this._complete = document.createElement('input');
        this._complete.setAttribute('type', 'checkbox');
        goal.append(
            `Rotate to the target ${comparison}:`,
            this._complete
        );

        this._progress = document.createElement('div');
        this._progress.classList.add('progress-meter');
        this._progress.style.setProperty('width', 0);
        const progressWrapper = document.createElement('div');
        progressWrapper.classList.add('progress-wrapper');
        progressWrapper.append(this._progress);

        this.element.append(
            goal,
            progressWrapper
        );
    }

    update(spin) {
        const progress = this.progressFunction(spin);

        this._progress.style.setProperty('width', (progress * 100).toFixed(2) + '%');

        if (!this._complete.checked && progress >= this.threshold) {
            this._complete.setAttribute('checked', '');
        }
    }
}

export default class Tutorial {
    element;
    stageIndex;
    stage;

    constructor() {
        this.element = document.createElement('div');
        this.element.classList.add('tutorial');

        this.element.append('');

        const footer = document.createElement('div');
        const back = document.createElement('button');
        back.innerText = 'Back';
        back.onclick = () => this._setStage((this.stageIndex - 1) % stages.length);
        const next = document.createElement('button');
        next.innerText = 'Next';
        next.onclick = () => this._setStage((this.stageIndex + 1) % stages.length);
        footer.append(back);
        footer.append(next);
        this.element.append(footer);

        this._setStage(0);
    }

    update(spin) {
        this.stage.update(spin);
    }

    _setStage(index) {
        this.stageIndex = index;
        this.stage = stages[index]();
        this.element.removeChild(this.element.childNodes[0]);
        this.element.prepend(this.stage.element);

        // MathJax is imported in spin-demo.html. The timeout ensures it is properly loaded.
        setTimeout(() => MathJax.typeset());
    }
}

const stages = [
    () => new Stage(`
<p>
Welcome to this quantum spin demo!
</p>
<p>
Shown above is a normalized complex two-vector that models the spin state of a
spin-\\(\\frac{1}{2}\\) particle which is being rotated in the same way as you
rotate your device. Tap 'Next' to learn more.
</p>
<p>
This tutorial was designed to be as accessible as possible. If you are
interested in the underlying mathematics of spinors, or in further insights into
the phenomenon of quantum spin, you are invited to explore the accompanying
website.
</p>
`),

    () => new StageWithGoal(
        `
<p>
Start out by getting a practical feel for the application \u2014 we'll turn to
the theory later. First, rotate to the \\(\\hat{z}\\)-up state:
</p>
\\[
\\begin{bmatrix}
e^{i \\theta} \\\\
0
\\end{bmatrix}
\\]
This should be possible by holding your device vertically (assuming the right
sensors are available). The green bar below fills up as you get closer.
`,
        [
            new Complex(1, 0),
            new Complex(0, 0)
        ],
        'state'
    ),

    () => new StageWithGoal(
        `
<p>
As the system is rotated about the \\(z\\)-axis, it should stay in the
\\(\\hat{z}\\)-up state, meaning that the complex vector can only change by an
overall phase factor.
</p>
<p>
Rotate your device about the vertical axis while continuing to hold it straight
up. In this way, locate the following vector:
</p>
\\[
\\begin{bmatrix}
1 \\\\
0
\\end{bmatrix}
\\]
`,
        [
            new Complex(1, 0),
            new Complex(0, 0)
        ],
        'vector'
    ),

    () => new StageWithGoal(
        `
<p>
One of the amazing properties of spin-\\(\\frac{1}{2}\\) is that rotating by 360
degrees does not give you back the original state vector, but rather results in
a phase factor of -1. To experience this for yourself, rotate to the negative of
the previous vector:
</p>
\\[
\\begin{bmatrix}
-1 \\\\
0
\\end{bmatrix}
\\]
`,
        [
            new Complex(-1, 0),
            new Complex(0, 0)
        ],
        'vector'
    ),

    () => new StageWithGoal(
        `
<p>
When performing a full rotation of 360 degrees, the axis does not matter. Rotate
about a horizontal axis instead of the vertical axis to go back to our original
vector:
</p>
\\[
\\begin{bmatrix}
1 \\\\
0
\\end{bmatrix}
\\]
`,
        [
            new Complex(1, 0),
            new Complex(0, 0)
        ],
        'vector'
    ),

    () => new StageWithGoal(
        `
<p>
The basis vectors were arbitrarily chosen to be the \\(\\hat{z}\\)-up and
\\(\\hat{z}\\)-down states, but we can reach the eigenstates of spin along any
other axis as well. Orient your phone horizontally and rotate about the vertical
axis until you reach the \\(\\hat{y}\\)-up state:
</p>
\\[
e^{i \\theta}\\begin{bmatrix}
1 \\\\
i
\\end{bmatrix}
\\]
<p>
You may want to make sure automatic screen rotation is disabled for what is to
come!
</p>
`,
        [
            new Complex(1, 0),
            new Complex(0, 1)
        ],
        'state'
    ),

    () => new Stage(`
<p>
Try changing the overall phase factor of the vector without changing the actual
state. You have to rotate about a different global (world) axis than before, but
it's still the same local (device) axis \u2014 it coincides with the direction
from the bottom to the top of your screen.
</p>
`),

    () => new StageWithGoal(
        `
<p>
Now find the \\(\\hat{x}\\)-up state:
</p>
\\[
e^{i \\theta}\\begin{bmatrix}
1 \\\\
1
\\end{bmatrix}
\\]
<p>
Hint: if you want to reach the vector for which \\(\\theta=0\\), you'll have to
tilt your device on its side.
</p>
`,
        [
            new Complex(1, 0),
            new Complex(1, 0)
        ],
        'vector'
    ),
];