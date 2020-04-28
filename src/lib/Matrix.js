// @flow
import Vec3 from 'lib/Vec3';

/**
 * This class represents a 4x4 matrix.
 * All operations are immutable by default (i.e. they return a new Matrix
 * instance without mutating the original matrix). YOu can pass a 'm' flag to
 * any operation to mutate the original vector.
 */
export default class Matrix {
  static IDENTITY = new Matrix();

  _m: Array<Array<number>> = [];
  _tempM: Array<Array<number>> = []; // temporary storage for matrix multiplication

  constructor() {
    this.makeIdentity('m');
  }

  clone(): Matrix {
    return new Matrix().set(this._m);
  }

  /**
   * Set matrix to be equal to `mat`, a 2d 4x4 array
   * @param {Array<Array<number>>} mat The matrix to set this matrix to
   * @param {'m' | 'i'} mutabilityType make this operation mutable or immutable
   */
  set(mat: Array<Array<number>>, mutabilityType?: 'm' | 'i' = 'i'): Matrix {
    const matrix = mutabilityType === 'm' ? this : this.clone();
    const m = matrix._m;
    mat.forEach((row, i) => {
      row.forEach((val, j) => {
        m[i][j] = val;
      });
    });
    return matrix;
  }

  /**
   * Set matrix to an identity matrix.
   * @param {'m' | 'i'} mutabilityType make this operation mutable or immutable
   */
  makeIdentity(mutabilityType?: 'm' | 'i' = 'i'): Matrix {
    const matrix = mutabilityType === 'm' ? this : this.clone();
    const m = matrix._m;
    const tempM = matrix._tempM;
    for (let i = 0; i < 4; i++) {
      if (!m[i]) {
        m[i] = [];
        tempM[i] = [];
      }

      for (let j = 0; j < 4; j++) {
        m[i][j] = i === j ? 1 : 0;
        tempM[i][j] = i === j ? 1 : 0;
      }
    }
    return matrix;
  }

  /**
   * Set matrix to be a Camera-to-Frame matrix.
   * @param {Vec3} u One of the orthogonal vectors of the frame
   * @param {Vec3} v One of the orthogonal vectors of the frame
   * @param {Vec3} w One of the orthogonal vectors of the frame
   * @param {Vec3} p The origin of the frame
   * @param {'m' | 'i'} mutabilityType make this operation mutable or immutable
   */
  setCameraToFrame(
    u: Vec3,
    v: Vec3,
    w: Vec3,
    p: Vec3,
    mutabilityType?: 'm' | 'i' = 'i',
  ): Matrix {
    const matrix = mutabilityType === 'm' ? this : this.clone();
    const m = matrix.makeIdentity('m')._m;
    m[0][0] = u.x();
    m[0][1] = u.y();
    m[0][2] = u.z();
    m[1][0] = v.x();
    m[1][1] = v.y();
    m[1][2] = v.z();
    m[2][0] = w.x();
    m[2][1] = w.y();
    m[2][2] = w.z();

    const temp = matrix.rightMultiplyVector(p, 'm');
    m[0][3] = -temp.x();
    m[1][3] = -temp.y();
    m[2][3] = -temp.z();
    return matrix;
  }

  /**
   * Set matrix to be a Frame-to-Camera matrix.
   * @param {Vec3} u One of the orthogonal vectors of the frame
   * @param {Vec3} v One of the orthogonal vectors of the frame
   * @param {Vec3} w One of the orthogonal vectors of the frame
   * @param {Vec3} p The origin of the frame
   * @param {'m' | 'i'} mutabilityType make this operation mutable or immutable
   */
  setFrameToCamera(
    u: Vec3,
    v: Vec3,
    w: Vec3,
    p: Vec3,
    mutabilityType?: 'm' | 'i' = 'i',
  ): Matrix {
    const matrix = mutabilityType === 'm' ? this : this.clone();
    const m = matrix.makeIdentity('m')._m;
    m[0][0] = u.x();
    m[0][1] = v.x();
    m[0][2] = w.x();
    m[0][3] = p.x();
    m[1][0] = u.y();
    m[1][1] = v.y();
    m[1][2] = w.y();
    m[1][3] = p.y();
    m[2][0] = u.z();
    m[2][1] = v.z();
    m[2][2] = w.z();
    m[2][3] = p.z();
    return matrix;
  }

  /**
   * Set matrix to a rotation about the given axis
   * @param {number} angleDegrees The rotation angle in degrees
   * @param {Vec3} axis The vector around which to rotate
   * @param {'m' | 'i'} mutabilityType make this operation mutable or immutable
   */
  makeRotationMatrix(
    angleDegrees: number,
    axis: Vec3,
    mutabilityType?: 'm' | 'i' = 'i',
  ): Matrix {
    const matrix = mutabilityType === 'm' ? this : this.clone();
    const angle = (angleDegrees * Math.PI) / 180;
    const u = axis.normalize();
    const ua = [u.x(), u.y(), u.z()];
    const m = matrix.makeIdentity('m')._m;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        m[i][j] = ua[i] * ua[j];
      }
    }

    const cosTheta = Math.cos(angle);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        m[i][j] += cosTheta * ((i === j ? 1 : 0) - ua[i] * ua[j]);
      }
    }

    const sinTheta = Math.sin(angleDegrees);
    m[1][2] -= sinTheta * u.x();
    m[2][1] += sinTheta * u.x();
    m[2][0] -= sinTheta * u.y();
    m[0][2] += sinTheta * u.y();
    m[0][1] -= sinTheta * u.z();
    m[1][0] += sinTheta * u.z();
    return matrix;
  }

  /**
   * Set matrix to represent a translation along a given vector
   * @param {Vec3} v The translation vector represented by this matrix
   * @param {'m' | 'i'} mutabilityType make this operation mutable or immutable
   */
  makeTranslationMatrix(v: Vec3, mutabilityType?: 'm' | 'i' = 'i'): Matrix {
    const matrix = mutabilityType === 'm' ? this : this.clone();
    const m = matrix.makeIdentity('m')._m;
    m[0][3] = v.x();
    m[1][3] = v.y();
    m[2][3] = v.z();
    return matrix;
  }

  /**
   * Set matrix to represent a scale using a given vector
   * @param {Vec3} v The vector containing the x, y, and z scale values
   * @param {'m' | 'i'} mutabilityType make this operation mutable or immutable
   */
  makeScaleMatrix(v: Vec3, mutabilityType?: 'm' | 'i' = 'i'): Matrix {
    const matrix = mutabilityType === 'm' ? this : this.clone();
    const m = matrix.makeIdentity('m')._m;
    m[0][0] = v.x();
    m[1][1] = v.y();
    m[2][2] = v.z();
    return matrix;
  }

  /**
   * Set matrix to be the left product of `t` and itself
   */
  leftCompose(t: Matrix, mutabilityType?: 'm' | 'i' = 'i'): Matrix {
    const matrix = mutabilityType === 'm' ? this : this.clone();
    const m = matrix._m;
    const tempM = matrix._tempM;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        tempM[i][j] = 0;
        for (let k = 0; k < 4; k++) {
          tempM[i][j] += t._m[i][k] * m[k][j];
        }
      }
    }

    return matrix.set(tempM, 'm');
  }

  /**
   * Set matrix to be the right product of `t` and itself
   */
  rightCompose(t: Matrix, mutabilityType?: 'm' | 'i' = 'i'): Matrix {
    const matrix = mutabilityType === 'm' ? this : this.clone();
    const m = matrix._m;
    const tempM = matrix._tempM;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        tempM[i][j] = 0;
        for (let k = 0; k < 4; k++) {
          tempM[i][j] += m[i][k] * t._m[k][j];
        }
      }
    }
    return matrix.set(tempM, 'm');
  }

  /**
   * Transform vector `v` by this matrix
   */
  rightMultiplyVector(v: Vec3, mutabilityType?: 'm' | 'i' = 'i'): Vec3 {
    const vec = mutabilityType === 'm' ? v : v.clone();
    const m = this._m;
    const x = m[0][0] * vec.x() + m[0][1] * vec.y() + m[0][2] * vec.z();
    const y = m[1][0] * vec.x() + m[1][1] * vec.y() + m[1][2] * vec.z();
    const z = m[2][0] * vec.x() + m[2][1] * vec.y() + m[2][2] * vec.z();
    return vec.set(x, y, z, 'm');
  }

  /**
   * Transform point `p` by this matrix
   */
  rightMultiplyPoint(p: Vec3, mutabilityType?: 'm' | 'i' = 'i'): Vec3 {
    const vec = mutabilityType === 'm' ? p : p.clone();
    const m = this._m;
    const x =
      m[0][0] * vec.x() + m[0][1] * vec.y() + m[0][2] * vec.z() + m[0][3];
    const y =
      m[1][0] * vec.x() + m[1][1] * vec.y() + m[1][2] * vec.z() + m[1][3];
    const z =
      m[2][0] * vec.x() + m[2][1] * vec.y() + m[2][2] * vec.z() + m[2][3];
    const w =
      m[3][0] * vec.x() + m[3][1] * vec.y() + m[3][2] * vec.z() + m[3][3];
    return vec.set(x / w, y / w, z / w, 'm');
  }

  transpose(mutabilityType?: 'm' | 'i'): Matrix {
    const matrix = mutabilityType === 'm' ? this : this.clone();
    const m = matrix._m;
    for (let r = 0; r < 3; r++) {
      for (let c = r; c < 4; c++) {
        const temp = m[r][c];
        m[r][c] = m[c][r];
        m[c][r] = temp;
      }
    }
    return matrix;
  }

  invert(mutabilityType?: 'm' | 'i'): Matrix {
    const matrix = mutabilityType === 'm' ? this : this.clone();

    // Use LU decomposition and backsubstitution
    const tmp = [];
    const m = matrix._m;
    for (let i = 0, r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++, i++) {
        tmp[i] = m[r][c];
      }
    }

    // Calculate LU decomposition: is the matrix singular?
    const rowPerm = [];
    const nonsingular = matrix._luDecomposition(tmp, rowPerm);
    if (!nonsingular) {
      throw new Error('Cannot invert a singular matrix.');
    }

    // Perform back substitution on the identity matrix
    const result = [];
    for (let i = 0; i < 16; i++) {
      result[i] = 0;
    }
    result[0] = 1;
    result[5] = 1;
    result[10] = 1;
    result[15] = 1;
    matrix._luBacksubstitution(tmp, rowPerm, result);

    // set the result
    for (let i = 0, r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++, i++) {
        m[r][c] = result[i];
      }
    }
    return matrix;
  }

  /**
   * Returns true if the matrix is nonsingular, false otherwise.
   * Reference: Press, Flannery, Tuekolsky, Vetterling,
   *   _Numerical_Recipes_in_C_, Cambridge University, Press,
   *   1988, pp 40-45.
   *
   * Side effects: this function changes the current matrix, it does not create
   * a new instance.
   * @param {Array<number>} matrix0 The matrix to decompose as a single array
   * @param {Array<number>} rowPerm The array where we will store the row
   * permutations
   * @returns {boolean} True if the matrix is nonsingular (meaning it has an
   * inverse), false otherwise.
   */
  _luDecomposition(matrix0: Array<number>, rowPerm: Array<number>): boolean {
    const rowScale = [];

    // Determine implicit scaling information by looping over rows
    let ptr = 0;
    let rs = 0;
    let i = 4;

    // For each row
    while (i-- !== 0) {
      let big = 0;

      // For each column, find the largest element in the row
      let j = 4;
      while (j-- !== 0) {
        let temp = matrix0[ptr++];
        temp = Math.abs(temp);
        if (temp > big) {
          big = temp;
        }
      }

      // Is the matrix singular?
      if (big === 0) {
        return false;
      }
      rowScale[rs++] = 1 / big;
    }

    // For all columns, execute Crout's method
    const mtx = 0;
    for (let j = 0; j < 4; j++) {
      let k = 0;
      let target = 0;
      let p1 = 0;
      let p2 = 0;
      let sum = 0;

      // Determine elements of upper diagonal matrix U
      for (let i = 0; i < j; i++) {
        target = mtx + 4 * i + j;
        sum = matrix0[target];
        k = i;
        p1 = mtx + 4 * i;
        p2 = mtx + j;
        while (k-- !== 0) {
          sum -= matrix0[p1] * matrix0[p2];
          p1++;
          p2 += 4;
        }
        matrix0[target] = sum;
      }

      // Search for largest pivot element and calculate
      // intermediate elements of lower diagonal matrix L
      let big = 0;
      let imax = -1;
      for (let i = j; i < 4; i++) {
        target = mtx + 4 * i + j;
        sum = matrix0[target];
        k = j;
        p1 = mtx + 4 * i;
        p2 = mtx + j;
        while (k-- !== 0) {
          sum -= matrix0[p1] * matrix0[p2];
          p1++;
          p2 += 4;
        }
        matrix0[target] = sum;

        // Is this the best pivot so far?
        let temp = rowScale[i] * Math.abs(sum);
        if (temp >= big) {
          big = temp;
          imax = i;
        }
      }

      if (imax < 0) {
        throw new Error('Error in luDecomposition. imax should not be < 0');
      }

      // Is a row exchange necessary?
      if (j !== imax) {
        // yes, exchange rows
        k = 4;
        p1 = mtx + 4 * imax;
        p2 = mtx + 4 * j;
        while (k-- !== 0) {
          let temp = matrix0[p1];
          matrix0[p1++] = matrix0[p2];
          matrix0[p2++] = temp;
        }

        // Record change in scale factor
        rowScale[imax] = rowScale[j];
      }

      // Record row permutation
      rowPerm[j] = imax;

      // Is the matrix singular
      if (matrix0[mtx + 4 * j + j] === 0) {
        return false;
      }

      // Divide elements of lower diagonal matrix L by pivot
      if (j !== 4 - 1) {
        let temp = 1 / matrix0[mtx + 4 * j + j];
        target = mtx + 4 * (j + 1) + j;
        i = 3 - j;
        while (i-- !== 0) {
          matrix0[target] *= temp;
          target += 4;
        }
      }
    }

    return true;
  }

  /**
   * Solves a set of linear equations.
   * The input parameters matrix1 and rowPerm come from luDecomposition and
   * do not change here. This takes each column of matrix2 and treats it as
   * the right-hand side of the matrix equation Ax = LUx = b. The solution
   * vector replaces the original column of the matrix.
   * Reference: Press, Flannery, Tuekolsky, Vetterling,
   *   _Numerical_Recipes_in_C_, Cambridge University, Press,
   *   1988, pp 44-45.
   *
   * Side effects: this function changes the current matrix, it does not create
   * a new instance.
   */
  _luBacksubstitution(
    matrix1: Array<number>,
    rowPerm: Array<number>,
    matrix2: Array<number>,
  ): void {
    let rv = 0;
    const rp = 0; // row permutation

    // For each column vector of matrix2
    for (let k = 0; k < 4; k++) {
      const cv = k;
      let ii = -1;

      // Forward substitution
      for (let i = 0; i < 4; i++) {
        const ip = rowPerm[rp + i];
        let sum = matrix2[cv + 4 * ip];
        matrix2[cv + 4 * ip] = matrix2[cv + 4 * i];
        if (ii >= 0) {
          rv = i * 4;
          for (let j = ii; j <= i - 1; j++) {
            sum -= matrix1[rv + j] * matrix2[cv + 4 * j];
          }
        } else if (sum !== 0) {
          ii = i;
        }
        matrix2[cv + 4 * i] = sum;
      }

      // Backsubstitution
      rv = 3 * 4;
      matrix2[cv + 4 * 3] /= matrix1[rv + 3];

      rv -= 4;
      matrix2[cv + 4 * 2] =
        (matrix2[cv + 4 * 2] - matrix1[rv + 3] * matrix2[cv + 4 * 3]) /
        matrix1[rv + 2];

      rv -= 4;
      matrix2[cv + 4 * 1] =
        (matrix2[cv + 4 * 1] -
          matrix1[rv + 2] * matrix2[cv + 4 * 2] -
          matrix1[rv + 3] * matrix2[cv + 4 * 3]) /
        matrix1[rv + 1];

      rv -= 4;
      matrix2[cv + 4 * 0] =
        (matrix2[cv + 4 * 0] -
          matrix1[rv + 1] * matrix2[cv + 4 * 1] -
          matrix1[rv + 2] * matrix2[cv + 4 * 2] -
          matrix1[rv + 3] * matrix2[cv + 4 * 3]) /
        matrix1[rv + 0];
    }
  }
}
