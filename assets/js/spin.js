init();

function init() {
    let sensor = null;
    try {
        sensor = new AbsoluteOrientationSensor();
        sensor.onerror = (event) => {
            // // Handle runtime errors.
            // if (event.error.name === "NotAllowedError") {
            //     // Branch to code for requesting permission.
            // } else if (event.error.name === "NotReadableError") {
            //     console.log("Cannot connect to the sensor.");
            // }
            showError(event.error.name);
        };
        sense(sensor);
    } catch (error) {
        // // Handle construction errors.
        // if (error.name === "SecurityError") {
        //     // See the note above about permissions policy.
        //     console.log("Sensor construction was blocked by a permissions policy.");
        // } else if (error.name === "ReferenceError") {
        //     console.log("Sensor is not supported by the User Agent.");
        // } else {
        //     throw error;
        // }
        showError(error.name);
    }
}

function sense(sensor) {
    document.body.innerHTML = `
    <div id="spin"></div>
    `
    const spin_vector = document.getElementById("spin");
    sensor.onreading = () => spin_vector.innerText = sensor.quaternion[0];
    sensor.start();
}

function showError(message) {
    document.body.innerHTML = `
    <h1>bad</h1>
    <blockquote>${message}</blockquote>
    `;
}