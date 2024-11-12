import MockSensor from './mock-sensor.mjs';
import SpinDemo from './spin-demo.mjs';

init();

function init() {
    let sensor = null;
    try {
        sensor = new AbsoluteOrientationSensor({ frequency: 60, referenceFrame: 'device' });
        sensor.onerror = (event) => {
            // if (event.error.name === "NotAllowedError") {
            // } else if (event.error.name === "NotReadableError") {
            sensor.stop();
            sensor.onreading = undefined;
            showError(event.error);
        };
        startDemo(sensor);
    } catch (error) {
        // if (error.name === "SecurityError") {
        // } else if (error.name === "ReferenceError") {
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
    // Set in spin-demo.html
    if (typeof jekyllEnvironment !== 'undefined' && jekyllEnvironment === 'development') {
        const sensor = new MockSensor();
        startDemo(sensor);
    } else {
        document.body.innerHTML = `
    <h1>${error.name}</h1>
    <blockquote>${error.message}</blockquote>
    `;
    }
}
