// @flow
import Vec3 from 'lib/Vec3';

export default class Ray {
  _origin: Vec3;
  _direction: Vec3;

  constructor(origin: Vec3, direction: Vec3) {
    this._origin = origin;
    this._direction = direction;
  }

  origin(): Vec3 {
    return this._origin;
  }

  direction(): Vec3 {
    return this._direction;
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
