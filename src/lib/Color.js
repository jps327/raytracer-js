// @flow
export default class Color {
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
   * Apply a gamma 2 correction on the color
   */
  gamma2(mutabilityType?: 'm' | 'i' = 'i'): Color {
    const col = mutabilityType === 'm' ? this : this.clone();
    col._r = Math.sqrt(col._r);
    col._g = Math.sqrt(col._g);
    col._b = Math.sqrt(col._b);
    return col;
  }

  multiply(c: Color, mutabilityType?: 'm' | 'i' = 'i'): Color {
    const col = mutabilityType === 'm' ? this : this.clone();
    col._r *= c._r;
    col._g *= c._g;
    col._b *= c._b;
    return col;
  }
}
