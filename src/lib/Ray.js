// @flow
import Vec3 from 'lib/Vec3';

export default class Ray {
  static EPSILON = 1e-6;

  _origin: Vec3;
  _direction: Vec3;
  _tMin: number;
  _tMax: number;

  constructor(
    origin: Vec3,
    direction: Vec3,
    tMin?: number = Ray.EPSILON,
    tMax?: number = Number.MAX_VALUE,
  ) {
    this._origin = origin;
    this._direction = direction;
    this._tMin = tMin;
    this._tMax = tMax;
  }

  clone(): Ray {
    return new Ray(this._origin, this._direction, this._tMin, this._tMax);
  }

  origin(): Vec3 {
    return this._origin;
  }

  direction(): Vec3 {
    return this._direction;
  }

  tMin(): number {
    return this._tMin;
  }

  tMax(): number {
    return this._tMax;
  }

  setTMax(t: number): void {
    this._tMax = t;
  }

  isValidTParam(t: number): boolean {
    return t >= this._tMin && t <= this._tMax;
  }

  /**
   * The point at parameter `t` is calculated as:
   *   p(t) = A + tB
   * where A is the origin and B is the direction of the ray.
   * @param {number} t The parameter at which we want to calculate the point
   * @returns {Vec3} the point at parameter `t`
   */
  pointAtParameter(t: number): Vec3 {
    return this._origin.addScaled(t, this._direction);
  }
}
