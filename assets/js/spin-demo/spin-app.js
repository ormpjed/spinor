import MockSensor from './mock-sensor.mjs';
import SpinDemo from './spin-demo.mjs';

const notAllowedInstructions = `
<p>
Additional permissions are required. Allow the use of motion sensors under
Settings > Site settings > Permissions > Motion sensors (this may be different
for your browser) and refresh this page.
</p>
`;

const notReadableInstructions = `
<p>
Unfortunately, no suitable sensors could be detected. Please visit this page on
a mobile device. If you are certain your device does have orientation sensors,
check whether your browser has been granted the right permissions in the app
settings.
</p>
`;

const referenceErrorInstructions = `
<p>
Your browser does not support sensor access. Make sure your browser is up to
date, or visit this page using a different browser. Most Chromium-base browsers
(such as Chrome, Edge, Opera, Samsung Internet, and many more) support sensor
access, while Firefox and Safari do not (as of 2024).
</p>
`;

const unknownErrorInstructions = `
<p>
Unfortunately, an unexpected error occurred.
</p>
`;

init();

function init() {
    let sensor = null;
    try {
        sensor = new RelativeOrientationSensor({ frequency: 60, referenceFrame: 'device' });
        sensor.onerror = (event) => {
            sensor.stop();
            sensor.onreading = undefined;
            showError(event.error);
        };
        startDemo(sensor);
    } catch (error) {
        showError(error);
    }
}

function startDemo(sensor) {
    const spinDemo = new SpinDemo(sensor);
    const body = document.createElement('body');
    body.appendChild(spinDemo.element);
    document.body = body;
}

function showError(error) {
    console.error(error);

    // Defined in spin-demo.html
    if (typeof jekyllEnvironment !== 'undefined' && jekyllEnvironment === 'development') {
        const sensor = new MockSensor();
        startDemo(sensor);
        return;
    }

    let instructions;
    switch (error.name) {
        case "NotAllowedError":
            instructions = notAllowedInstructions;
            break;
        case "NotReadableError":
            instructions = notReadableInstructions;
            break;
        case "ReferenceError":
            instructions = referenceErrorInstructions;
            break;
        default:
            instructions = unknownErrorInstructions;
    }

    document.body.innerHTML = `
<div class="error">

<p>
Welcome!
</p>

<p>
This app generates a spin-state vector based on the motion sensors of your
device. It therefore only works on a mobile device in a browser that is able to
provide sensor access.
</p>

${instructions}

<p>
You can also browse the rest of <a href="/">this website</a> instead.
</p>

<p>
The error encountered is as follows:
<blockquote>
${error.name}: ${error.message}
</blockquote>
</p>

</div>
`;
}
