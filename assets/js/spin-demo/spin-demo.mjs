import DialView from "./dial-view.mjs";
import { Complex, Quaternion } from "./math.mjs";
import Tutorial from "./tutorial.mjs";
import VectorView from "./vector-view.mjs";

// A quarter turn about the negative x-axis
const reorient = new Quaternion([-1, 0, 0, 1]).scaled(Math.SQRT1_2);

export default class SpinDemo {
    _sensor;

    // Arbitrary initial value
    _liftedOrientationQuaternion = new Quaternion([0, 0, 0, 1]);

    _element;
    _children = [];

    constructor(sensor) {
        this._sensor = sensor;

        this._element = document.createElement('div');
        const top = document.createElement('div');
        const bottom = document.createElement('div');
        top.classList.add('top');
        bottom.classList.add('bottom');
        this._element.append(top, bottom);

        const vectorView = new VectorView(2, 'complex');
        vectorView.setColors('red', 'blue');
        const dialView = new DialView();
        top.append(vectorView.element, dialView.element);

        const tutorial = new Tutorial();
        bottom.append(tutorial.element);

        this._children.push(vectorView, dialView, tutorial);

        this._sensor.onreading = () => this._update();
        this._sensor.start();
    }

    get element() {
        return this._element;
    }

    _update() {
        let orientationQuaternion = new Quaternion(this._sensor.quaternion);

        /*
        The sensor output is not continuous, as it works with an SO(3)
        understanding of rotation, and is limited to rotations of 180
        degrees. To turn it into a continuous quaternion (which is equivalent
        to solving a lifting problem from SO(3) to the unit quaternions), we
        pick the antipode that is closest to the previous reading.
        */
        this._liftedOrientationQuaternion = this._liftedOrientationQuaternion.dot(orientationQuaternion) >= 0 ?
            orientationQuaternion : orientationQuaternion.scaled(-1);

        const spin = this._orientationToSpin(this._liftedOrientationQuaternion);
        this._children.forEach(c => c.update(spin));
    }

    _orientationToSpin(orientation) {
        /*
        The sensor reading is the quaternion that represents the rotation from
        the global frame of reference to the device frame of reference.

        The global frame of reference has its x axis pointing to the east, the y
        axis pointing to the north, and z axis pointing up.

        For the device frame of reference, x is the horizontal and y the
        vertical axis of the device, while the z axis points out of the screen.

        The global and local frame of reference are aligned when the device is
        lying down flat with its top facing north. In this position, the sensor
        reading is the unit quaternion (or possibly its negation, when already
        lifted).
        
        We first reorient so that we get the unit quaternion when the device is
        held straight up, facing north with its back. In this position, the
        sensor reading will be a quaternion representing a quarter turn about
        the x-axis (since that is how the device is rotated, relative to when
        the reading was the unit quaternion), so we multiply by its inverse.
        */

        const r = orientation.times(reorient)

        /*
        We then get the following mappings:
        Unit quaternion ~ no rotation => z-up = (1, 0)
        (1 + i)/sqrt(2) ~ quarter turn about x-axis => y-down = (1, -i)/sqrt(2)
        (1 + j)/sqrt(2) ~ quarter turn about y-axis => x-up = (1, 1)/sqrt(2)
        (1 + k)/sqrt(2) ~ quarter turn about z-axis => phase factor: (1 - i)/sqrt(2)

        The last mapping might be surprising: a right-handed spatial rotation
        results in a clockwise rotation (in the complex plane) of the overall
        phase. This stems from differing conventions between physicists and
        mathematicians. Counterclockwise rotation of the phase is only possible
        if (1, -i) represents y-up instead of y-down, which would therefore be a
        more natural choice, but would probably be confusing as well.

        In any case, the above constraints are uniquely satisfied by the
        following mapping:
        */

        return [
            new Complex(r.w, -r.z),
            new Complex(r.y, -r.x),
        ];
    }
}