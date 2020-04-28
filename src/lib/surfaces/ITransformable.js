// @flow
import type Matrix from 'lib/Matrix';

export interface ITransformable {
  computeBoundingBox(): void;
  setTransformation(tMat: Matrix, tMatInv: Matrix, tMatTInv: Matrix): void;
}
