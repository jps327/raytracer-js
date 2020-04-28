// @flow

function _clamp(low: number, high: number, val: number): number {
  if (val > high) {
    return high;
  } else if (val < low) {
    return low;
  } else {
    return val;
  }
}

/**
 * This class represents a Color with r, g, b values.
 * All operations are immutable by default. You can pass a 'm' flag to any
 * operation to mutate the original color.
 */
export default class Color {
  static RED = () => new Color(1, 0, 0);
  static GREEN = () => new Color(0, 1, 0);
  static WHITE = () => new Color(1, 1, 1);
  static BLACK = () => new Color(0, 0, 0);
  static BLUE = () => new Color(0, 0, 1);
  static GRAY = () => new Color(0.5, 0.5, 0.5);
  static YELLOW = () => new Color(1, 1, 0);

  _r: number;
  _g: number;
  _b: number;

  constructor(red: number, green: number, blue: number) {
    this._r = red;
    this._g = green;
    this._b = blue;
  }

  clone(): Color {
    return new Color(this._r, this._g, this._b);
  }

  r(): number {
    return this._r;
  }

  g(): number {
    return this._g;
  }

  b(): number {
    return this._b;
  }

  add(v: Color, mutabilityType?: 'm' | 'i' = 'i'): Color {
    const col = mutabilityType === 'm' ? this : this.clone();
    col._r += v._r;
    col._g += v._g;
    col._b += v._b;
    return col;
  }

  subtract(v: Color, mutabilityType?: 'm' | 'i' = 'i'): Color {
    const col = mutabilityType === 'm' ? this : this.clone();
    col._r -= v._r;
    col._g -= v._g;
    col._b -= v._b;
    return col;
  }

  /**
   * Add t*v to this color
   */
  addScaled(t: number, v: Color, mutabilityType?: 'm' | 'i' = 'i'): Color {
    const col = mutabilityType === 'm' ? this : this.clone();
    col._r += t * v._r;
    col._g += t * v._g;
    col._b += t * v._b;
    return col;
  }

  /**
   * Subtract t*v from this color
   */
  subtractScaled(t: number, v: Color, mutabilityType?: 'm' | 'i' = 'i'): Color {
    const col = mutabilityType === 'm' ? this : this.clone();
    col._r -= t * v._r;
    col._g -= t * v._g;
    col._b -= t * v._b;
    return col;
  }

  scale(t: number, mutabilityType?: 'm' | 'i' = 'i'): Color {
    const col = mutabilityType === 'm' ? this : this.clone();
    col._r *= t;
    col._g *= t;
    col._b *= t;
    return col;
  }

  scaleInverse(t: number, mutabilityType?: 'm' | 'i' = 'i'): Color {
    const col = mutabilityType === 'm' ? this : this.clone();
    col._r /= t;
    col._g /= t;
    col._b /= t;
    return col;
  }

  /**
   * Apply a gamma correction on the color
   */
  gammaCorrect(gamma: number, mutabilityType?: 'm' | 'i' = 'i') {
    const col = mutabilityType === 'm' ? this : this.clone();
    const inverseGamma = 1 / gamma;
    col._r = Math.pow(col._r, inverseGamma);
    col._g = Math.pow(col._g, inverseGamma);
    col._b = Math.pow(col._b, inverseGamma);
    return col;
  }

  multiply(c: Color, mutabilityType?: 'm' | 'i' = 'i'): Color {
    const col = mutabilityType === 'm' ? this : this.clone();
    col._r *= c._r;
    col._g *= c._g;
    col._b *= c._b;
    return col;
  }

  clampColor(mutabilityType?: 'm' | 'i'): Color {
    const col = mutabilityType === 'm' ? this : this.clone();
    col._r = _clamp(0, 1, col._r);
    col._g = _clamp(0, 1, col._g);
    col._b = _clamp(0, 1, col._b);
    return col;
  }
}
