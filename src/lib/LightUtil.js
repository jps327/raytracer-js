// @flow
import type Color from 'lib/Color';
import type Vec3 from 'lib/Vec3';
import type { Light } from 'lib/types';

const LightUtil = {
  /**
   * Scale a color by a given light's intensity
   */
  scaleColor(color: Color, light: Light): Color {
    return color.multiply(light.intensity);
  },
};

export default LightUtil;
