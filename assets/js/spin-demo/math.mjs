export class Quaternion {
    values;

    constructor(values) {
        this.values = values;
    }

    get w() {
        return this.values[0];
    }

    get x() {
        return this.values[1];
    }

    get y() {
        return this.values[2];
    }

    get z() {
        return this.values[3];
    }

    scaled(scale) {
        return new Quaternion(this.values.map(v => v * scale));
    }

    dot(other) {
        let sum = 0;
        for (let i = 0; i < 4; i++) {
            sum += this.values[i] * other.values[i];
        }
        return sum;
    }

    times(other) {
        return new Quaternion([
            this.w * other.w - this.x * other.x - this.y * other.y - this.z * other.z,
            this.w * other.x + this.x * other.w + this.y * other.z - this.z * other.y,
            this.w * other.y - this.x * other.z + this.y * other.w + this.z * other.x,
            this.w * other.z + this.x * other.y - this.y * other.x + this.z * other.w,
        ]);
    }
}

export class Complex {
    real;
    imag;

    constructor(real, imag) {
        this.real = real;
        this.imag = imag;
    }
} 