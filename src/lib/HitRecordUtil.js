// @flow
import Ray from 'lib/Ray';
import type Scene from 'lib/Scene';
import type Vec3 from 'lib/Vec3';
import type { HitRecord, Light } from 'lib/types';

const HitRecordUtil = {
  /**
   * Compute a toEye vector - a unit vector from the point of intersection to
   * the ray's origin.
   */
  getVectorToEye(hitRecord: HitRecord, ray: Ray): Vec3 {
    return ray
      .origin()
      .subtract(hitRecord.p)
      .normalize('m');
  },

  /**
   * Get a vector from the hit record's point of intersection to the light
   * source.
   */
  getVectorToLight(hitRecord: HitRecord, light: Light): Vec3 {
    return light.position.subtract(hitRecord.p).normalize('m');
  },

  /**
   * Check to see if the point we've intersected is being shadowed, that way we
   * know not to color it.
   */
  isShadowed(hitRecord: HitRecord, light: Light, scene: Scene): boolean {
    const pointOfIntersection = hitRecord.p;

    // create a shadow ray to start at the surface and end at the light
    const ray = new Ray(
      pointOfIntersection,
      light.position.subtract(pointOfIntersection),
      Ray.EPSILON,
      1,
    );

    return scene.getAnyIntersection(ray) === undefined;
  },
};

export default HitRecordUtil;
