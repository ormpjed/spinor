import MockSensor from './mock-sensor.mjs';
import SpinApp from './spin-app.mjs';

init();

function init() {
    let sensor = null;
    try {
        sensor = new AbsoluteOrientationSensor({frequency: 60});
        sensor.onerror = (event) => {
            // if (event.error.name === "NotAllowedError") {
            // } else if (event.error.name === "NotReadableError") {
            sensor.stop();
            sensor.onreading = undefined;
            showError(event.error);
        };
        startApp(sensor);
    } catch (error) {
        // if (error.name === "SecurityError") {
        // } else if (error.name === "ReferenceError") {
        showError(error);
    }
}

function startApp(sensor) {
    const spinApp = new SpinApp(sensor);
    const body = document.createElement('body');
    body.appendChild(spinApp.element);
    document.body = body;
}

function showError(error) {
    // startApp(new MockSensor({ frequency: 2 }));
    document.body.innerHTML = `
    <h1>${error.name}</h1>
    <blockquote>${error.message}</blockquote>
    `;
    console.error(error);
}
