// @flow
import Ray from 'lib/Ray';
import Vec3 from 'lib/Vec3';
import { randomPointInUnitDisk } from 'lib/util';

export default class Camera {
  _lensRadius: number;
  _lowerLeftCorner: Vec3;
  _horizontal: Vec3;
  _vertical: Vec3;
  _origin: Vec3;
  _u: Vec3; // unit vector in X axis on camera's plane
  _v: Vec3; // unit vector in Y axis on camera's plane

  /**
   * @param {Vec3} lookFrom The point from which the camera looks
   * @param {Vec3} lookAt The to which the camera looks
   * @param {Vec3} vup The "view up" vector for this camera
   * @param {number} vfov Vertical field of view (top to bottom in degrees)
   * @param {number} aspect The aspect ratio
   * @param {number} aperture The diameter of the camera aperture
   * @param {number} focusDistance The distance from the camera lens to the
   * focus plane
   */
  constructor(cameraConfig: {
    lookFrom: Vec3,
    lookAt: Vec3,
    vup: Vec3,
    vfov: number,
    aspect: number,
    aperture: number,
    focusDistance: number,
  }) {
    const {
      lookFrom,
      lookAt,
      vup,
      vfov,
      aspect,
      aperture,
      focusDistance,
    } = cameraConfig;

    const theta = (vfov * Math.PI) / 180;
    const halfHeight = Math.tan(theta / 2);
    const halfWidth = aspect * halfHeight;
    const w = lookFrom.subtract(lookAt).makeUnitVector('m');
    const u = vup.cross(w).makeUnitVector('m');
    const v = w.cross(u);

    this._u = u;
    this._v = v;
    this._origin = lookFrom;
    this._lowerLeftCorner = this._origin
      .subtractScaled(halfWidth * focusDistance, u)
      .subtractScaled(halfHeight * focusDistance, v, 'm')
      .subtractScaled(focusDistance, w, 'm');
    this._horizontal = u.scale(2 * halfWidth * focusDistance);
    this._vertical = v.scale(2 * halfHeight * focusDistance);
    this._lensRadius = aperture / 2;
  }

  getRay(s: number, t: number): Ray {
    // const rd = randomPointInUnitDisk().scale(this._lensRadius);
    // const offset = this._u.scale(rd.x()).addScaled(rd.y(), this._v, 'm');
    const offset = new Vec3(0, 0, 0);
    const direction = this._lowerLeftCorner
      .addScaled(s, this._horizontal)
      .addScaled(t, this._vertical, 'm')
      .subtract(this._origin, 'm')
      .subtract(offset, 'm');
    return new Ray(this._origin.add(offset), direction);
  }
}
