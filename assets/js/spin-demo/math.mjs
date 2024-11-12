export class Quaternion {
    values;

    constructor(values) {
        this.values = values;
    }

    get x() {
        return this.values[0];
    }

    get y() {
        return this.values[1];
    }

    get z() {
        return this.values[2];
    }

    get w() {
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
            this.w * other.x + this.x * other.w + this.y * other.z - this.z * other.y,
            this.w * other.y - this.x * other.z + this.y * other.w + this.z * other.x,
            this.w * other.z + this.x * other.y - this.y * other.x + this.z * other.w,
            this.w * other.w - this.x * other.x - this.y * other.y - this.z * other.z,
        ]);
    }

    conjugated() {
        return new Quaternion([-this.x, -this.y, -this.z, this.w]);
    }
}

export class Complex {
    real;
    imag;

    constructor(real, imag) {
        this.real = real;
        this.imag = imag;
    }

    plus(other) {
        return new Complex(
            this.real + other.real,
            this.imag + other.imag
        );
    }

    times(other) {
        return new Complex(
            this.real * other.real - this.imag * other.imag,
            this.real * other.imag + this.imag * other.real
        );
    }

    norm2() {
        return Math.pow(this.real, 2) + Math.pow(this.imag, 2);
    }
} 

export function spinToEuclideanVector(spin) {
    return [
        2 * spin[0].times(spin[1]).real,
        2 * spin[0].times(spin[1]).imag,
        spin[0].norm2() - spin[1].norm2(),
    ];
}