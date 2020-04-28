// @flow
import Ray from 'lib/Ray';
import Matrix from 'lib/Matrix';
import type { IShader } from 'lib/shaders/IShader';
import type { ITransformable } from 'lib/surfaces/ITransformable';

/**
 * The base class for all surfaces (e.g. box, sphere, etc.)
 */
export default class BaseSurface implements ITransformable {
  // TODO: $AABBOptimization - add fields for bounding box
  _tMat: Matrix = new Matrix(); // transformation matrix
  _tMatInv: Matrix = new Matrix(); // inverse of the trasnformation matrix
  _tMatTInv: Matrix = new Matrix(); // inverse of the transpose of the transformation matrix
  _shader: IShader;

  /**
   * @param {Shader} shader The shader that this surface uses
   */
  constructor(shader: IShader) {
    this._shader = shader;
  }

  /**
   * Set the transformation matrices for this surface
   *
   * Side effect: this function mutates the current BaseSurface instance
   */
  setTransformation(tMat: Matrix, tMatInv: Matrix, tMatTInv: Matrix): void {
    this._tMat = tMat;
    this._tMatInv = tMatInv;
    this._tMatTInv = tMatTInv;
    this.computeBoundingBox();
  }

  // TODO: $AABBOptimization - computeBoundingBox();
  computeBoundingBox(): void {
    // throw new Error('This function must be overridden');
    return undefined;
  }

  /**
   * Untransform ray using tMatInv
   */
  untransformRay(ray: Ray): Ray {
    const tMatInv = this._tMatInv;
    const newDirection = tMatInv.rightMultiplyVector(ray.direction());
    const newOrigin = tMatInv.rightMultiplyPoint(ray.origin());
    return new Ray(newOrigin, newDirection);
  }
}
