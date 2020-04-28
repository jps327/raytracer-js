// @flow

/**
 * This class represents a vector with 3 values.
 * All vector operations are immutable by default (i.e. they return a new Vec3
 * instance without mutating the original vector). You can pass a 'm' flag to
 * any operation to mutate the original vector.
 */
export default class Vec3 {
  _a: number;
  _b: number;
  _c: number;

  constructor(a: number, b: number, c: number) {
    this._a = a;
    this._b = b;
    this._c = c;
  }

  x(): number {
    return this._a;
  }

  y(): number {
    return this._b;
  }

  z(): number {
    return this._c;
  }

  clone(): Vec3 {
    return new Vec3(this._a, this._b, this._c);
  }

  set(x: number, y: number, z: number, mutabilityType?: 'm' | 'i' = 'i'): Vec3 {
    const vec = mutabilityType === 'm' ? this : this.clone();
    vec._a = x;
    vec._b = y;
    vec._c = z;
    return vec;
  }

  makeUnitVector(mutabilityType?: 'm' | 'i' = 'i'): Vec3 {
    const vec = mutabilityType === 'm' ? this : this.clone();
    const len = Math.sqrt(vec._a * vec._a + vec._b * vec._b + vec._c * vec._c);
    vec._a /= len;
    vec._b /= len;
    vec._c /= len;
    return vec;
  }

  /**
   * An alias for makeUnitVector
   */
  normalize(mutabilityType?: 'm' | 'i'): Vec3 {
    return this.makeUnitVector(mutabilityType);
  }

  /**
   * Validate that this vector is a unit vector. Throw an error if it's not.
   */
  validateIsUnit(vectorName?: string): void {
    if (this.squaredLength() !== 1) {
      if (vectorName) {
        throw new Error(`${vectorName} is not a unit vector`);
      }
      throw new Error('This vector is not a unit vector');
    }
  }

  length(): number {
    return Math.sqrt(this._a * this._a + this._b * this._b + this._c * this._c);
  }

  squaredLength(): number {
    return this._a * this._a + this._b * this._b + this._c * this._c;
  }

  dot(v: Vec3): number {
    return this._a * v._a + this._b * v._b + this._c * v._c;
  }

  cross(v: Vec3, mutabilityType?: 'm' | 'i' = 'i'): Vec3 {
    const vec = mutabilityType === 'm' ? this : this.clone();
    const newA = vec._b * v._c - vec._c * v._b;
    const newB = vec._c * v._a - vec._a * v._c;
    const newC = vec._a * v._b - vec._b * v._a;

    vec._a = newA;
    vec._b = newB;
    vec._c = newC;
    return vec;
  }

  add(v: Vec3, mutabilityType?: 'm' | 'i' = 'i'): Vec3 {
    const vec = mutabilityType === 'm' ? this : this.clone();
    vec._a += v._a;
    vec._b += v._b;
    vec._c += v._c;
    return vec;
  }

  subtract(v: Vec3, mutabilityType?: 'm' | 'i' = 'i'): Vec3 {
    const vec = mutabilityType === 'm' ? this : this.clone();
    vec._a -= v._a;
    vec._b -= v._b;
    vec._c -= v._c;
    return vec;
  }

  /**
   * Add t*v to this vector
   */
  addScaled(t: number, v: Vec3, mutabilityType?: 'm' | 'i' = 'i'): Vec3 {
    const vec = mutabilityType === 'm' ? this : this.clone();
    vec._a += t * v._a;
    vec._b += t * v._b;
    vec._c += t * v._c;
    return vec;
  }

  /**
   * Subtract t*v from this vector
   */
  subtractScaled(t: number, v: Vec3, mutabilityType?: 'm' | 'i' = 'i'): Vec3 {
    const vec = mutabilityType === 'm' ? this : this.clone();
    vec._a -= t * v._a;
    vec._b -= t * v._b;
    vec._c -= t * v._c;
    return vec;
  }

  scale(t: number, mutabilityType?: 'm' | 'i' = 'i'): Vec3 {
    const vec = mutabilityType === 'm' ? this : this.clone();
    vec._a *= t;
    vec._b *= t;
    vec._c *= t;
    return vec;
  }

  /**
   * Scale this vector by the inverse of `t` (i.e. 1 / t)
   */
  scaleInverse(t: number, mutabilityType?: 'm' | 'i' = 'i'): Vec3 {
    const vec = mutabilityType === 'm' ? this : this.clone();
    vec._a /= t;
    vec._b /= t;
    vec._c /= t;
    return vec;
  }

  /**
   * Reflect this vector across a given vector `n`
   */
  reflect(n: Vec3, mutabilityType?: 'm' | 'i' = 'i'): Vec3 {
    const vec = mutabilityType === 'm' ? this : this.clone();
    return vec.subtractScaled(2 * vec.dot(n), n);
  }

  /**
   * Refract this vector across a boundary where `n` is the surface normal,
   * and `refractiveIndexRatio` is the ratio of the refractive indices of
   * the two surfaces.
   *
   * This function does not have an option to mutate the current instance.
   * It will always return a new vector, or `undefined` if there is no
   * refraction across the surface boundary (i.e. total internal reflection
   * occurred).
   */
  refract(n: Vec3, refractiveIndexRatio: number): Vec3 | void {
    const unitVec = this.makeUnitVector();
    const dt = unitVec.dot(n);
    const discriminant =
      1 - refractiveIndexRatio * refractiveIndexRatio * (1 - dt * dt);
    if (discriminant > 0) {
      return unitVec
        .subtractScaled(dt, n, 'm')
        .scale(refractiveIndexRatio, 'm')
        .subtractScaled(Math.sqrt(discriminant), n, 'm');
    }
    return undefined;
  }
}
