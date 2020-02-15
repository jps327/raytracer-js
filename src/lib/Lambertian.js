// @flow
import Color from 'lib/Color';
import Ray from 'lib/Ray';
import { randomPointInUnitSphere } from 'lib/util';
import type { HitRecord, Material, ScatterRecord } from 'lib/types';

export default class Lambertian implements Material {
  // albedo is the measure of diffuse reflection of solar radiation, i.e.
  // the base color of this material
  _albedo: Color;
  constructor(albedo: Color) {
    this._albedo = albedo;
  }

  /**
   * Diffuse shading: get a ray that goes through a random point in a unit
   * sphere that is tangent to the hit point. This represents the ray being
   * randomly reflected when it hits the object.
   */
  scatter(ray: Ray, hitRecord: HitRecord): ScatterRecord {
    const hitPoint = hitRecord.p;
    const target = hitPoint
      .add(hitRecord.normal)
      .add(randomPointInUnitSphere(), 'm');
    const scatteredRay = new Ray(hitPoint, target.subtract(hitPoint, 'm'));
    return { scatteredRay, attenuation: this._albedo };
  }
}
