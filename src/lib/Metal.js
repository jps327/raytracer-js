// @flow
import Color from 'lib/Color';
import Ray from 'lib/Ray';
import { randomPointInUnitSphere } from 'lib/util';
import type { HitRecord, Material, ScatterRecord } from 'lib/types';

export default class Metal implements Material {
  // albedo is the measure of diffuse reflection of solar radiation, i.e.
  // the base color of this material
  _albedo: Color;

  // the fuzziness of this metal. We use this parameter to randomize the
  // scattering of the ray
  _fuzziness: number;

  constructor(albedo: Color, fuzziness: number) {
    this._albedo = albedo;
    this._fuzziness = Math.min(fuzziness, 1); // fuziness clamped at max 1
  }

  scatter(ray: Ray, hitRecord: HitRecord): ScatterRecord | void {
    const N = hitRecord.normal;
    const reflected = ray
      .direction()
      .makeUnitVector()
      .reflect(N, 'm');
    const scatteredRay = new Ray(
      hitRecord.p,
      reflected.addScaled(this._fuzziness, randomPointInUnitSphere()),
    );
    return scatteredRay.direction().dot(N) > 0
      ? { scatteredRay, attenuation: this._albedo }
      : undefined;
  }
}
