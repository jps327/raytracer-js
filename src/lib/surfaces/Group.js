// @flow
import Matrix from 'lib/Matrix';
import Vec3 from 'lib/Vec3';
import type { ITransformable } from 'lib/surfaces/ITransformable';
import type { RenderableSurface } from 'lib/types';

type GroupConfig = {
  // list of surfaces under this group
  // eslint-disable-next-line no-use-before-define
  +surfaces?: Array<RenderableSurface | Group>,

  // the transformation matrix associated with this group
  +transformationMatrix?: Matrix,
};

// a shared temporary matrix
const tmpMat = new Matrix();

export default class Group implements ITransformable {
  _surfaces: Array<RenderableSurface | Group>;
  _transformationMatrix: Matrix;

  constructor({
    surfaces = [],
    transformationMatrix = new Matrix(),
  }: GroupConfig) {
    this._surfaces = surfaces;
    this._transformationMatrix = transformationMatrix;
  }

  /**
   * Compute tMat, tMatInv, tMatTInv for this group and propagate values to the
   * children under it.
   *
   */
  setTransformation(tMatrix: Matrix): void {
    // we apply the transformation from bottom-up the tree. i.e. the child's
    // transformation will be applied to objects before its parent's
    const tMat = tMatrix.rightCompose(this._transformationMatrix);
    const tMatInv = tMat.invert();
    const tMatTInv = tMatInv.transpose();

    this._surfaces.forEach(surface => {
      if (surface instanceof Group) {
        surface.setTransformation(tMat);
      } else {
        surface.setTransformation(tMat, tMatInv, tMatTInv);
      }
    });
    this.computeBoundingBox();
  }

  /**
   * Set a translation vector for this group
   * Side effect: this function mutates the current Group instance
   */
  setTranslate(tVector: Vec3): Group {
    this._transformationMatrix.rightCompose(
      tmpMat.makeTranslationMatrix(tVector, 'm'),
      'm',
    );
    return this;
  }

  /**
   * Set a rotation vector for this group
   * Side effect: this function mutates the current Group instance
   */
  setRotate(rVector: Vec3): Group {
    this._transformationMatrix.rightCompose(
      tmpMat.makeRotationMatrix(rVector.z(), new Vec3(0, 0, 1), 'm'),
      'm',
    );
    this._transformationMatrix.rightCompose(
      tmpMat.makeRotationMatrix(rVector.y(), new Vec3(0, 1, 0), 'm'),
      'm',
    );
    this._transformationMatrix.rightCompose(
      tmpMat.makeRotationMatrix(rVector.x(), new Vec3(1, 0, 0), 'm'),
      'm',
    );
    return this;
  }

  /**
   * Set a scale vector for this group
   * Side effect: this function mutates the current Group instance
   */
  setScale(sVector: Vec3): Group {
    this._transformationMatrix.rightCompose(
      tmpMat.makeScaleMatrix(sVector, 'm'),
      'm',
    );
    return this;
  }

  forEachSurface(fn: (RenderableSurface | Group) => void): void {
    this._surfaces.forEach(fn);
  }

  /**
   * Add a surface to this group
   * Side effect: this function mutates the current Group instance
   */
  addSurface(surface: RenderableSurface | Group): Group {
    this._surfaces.push(surface);
    return this;
  }

  // TODO: $AABBOptimization - implement this function
  computeBoundingBox(): void {
    return undefined;
  }
}
