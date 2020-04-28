// @flow
import Ray from 'lib/Ray';
import Vec3 from 'lib/Vec3';

type CameraConfig = {
  +eye?: Vec3,
  +viewDirection?: Vec3,
  +up?: Vec3,
  +projectionDistance?: number,
  +viewWidth?: number,
  +viewHeight?: number,
};

export default class Camera {
  _eye: Vec3;
  _projectionDistance: number;
  _basisU: Vec3;
  _basisV: Vec3;
  _basisW: Vec3;
  _viewWidth: number;
  _viewHeight: number;
  _bottom: number;
  _top: number;
  _left: number;
  _right: number;

  static DEFAULT = new Camera({
    eye: new Vec3(0, 0, 1),
    viewDirection: new Vec3(0, 0, -1),
    up: new Vec3(0, 1, 0),
    projectionDistance: 1,
    viewWidth: 1,
    viewHeight: 1,
  });

  constructor({
    eye = new Vec3(0, 0, 1),
    viewDirection = new Vec3(0, 0, -1),
    up = new Vec3(0, 1, 0),
    projectionDistance = 1,
    viewWidth = 1,
    viewHeight = 1,
  }: CameraConfig) {
    this._eye = eye;
    this._projectionDistance = projectionDistance;
    this._basisW = viewDirection.scale(-1).normalize('m');
    this._basisU = up.cross(this._basisW).normalize('m');
    this._basisV = this._basisW.cross(this._basisU).normalize('m');
    this.setViewHeight(viewHeight);
    this.setViewWidth(viewWidth);
  }

  left(): number {
    return this._left;
  }

  right(): number {
    return this._right;
  }

  top(): number {
    return this._top;
  }

  bottom(): number {
    return this._bottom;
  }

  setViewHeight(height: number): void {
    this._viewHeight = height;
    this._bottom = -this._viewHeight / 2;
    this._top = this._viewHeight / 2;
  }

  setViewWidth(width: number): void {
    this._viewWidth = width;
    this._left = -this._viewWidth / 2;
    this._right = this._viewWidth / 2;
  }

  /**
   * Generate a ray going from the camera through a point in the image.
   * @param {number} u X coordinate of image in range [0, 1]
   * @param {number} v Y coordinate of image in range [0, 1]
   */
  getRay(u: number, v: number): Ray {
    // s is the point on the image which our ray intersects
    const s = this._eye
      .addScaled(u, this._basisU)
      .addScaled(v, this._basisV, 'm')
      .subtractScaled(this._projectionDistance, this._basisW, 'm');

    const direction = s.subtract(this._eye, 'm').normalize('m');
    return new Ray(this._eye, direction);
  }
}
