// @flow
import Color from 'lib/Color';
import Ray from 'lib/Ray';
import Vec3 from 'lib/Vec3';

/**
 * This record holds a bunch of information about a ray's intersection with
 * a Hittable surface.
 */
export type HitRecord = {
  /** The `t` value at which the ray intersects with a Hittable surface */
  t: number,

  /** The point at which the ray intersects with a Hittable surface */
  p: Vec3,

  /** The normal at the point where we hit a Hittable surface */
  normal: Vec3,

  /** The material of the surface we hit */
  material: Material,
};

/**
 * This record holds information about the scattering of a ray after it
 * hits a surface's material.
 */
export type ScatterRecord = {
  /** The computed color on the material at the point of contact */
  attenuation: Color,

  /**
   * The new ray to recurse on (assuming a new ray was produced, e.g. as in
   * metal or glass objects materials)
   */
  scatteredRay: Ray,
};

export interface Hittable {
  /**
   * Returns a HitRecord if the `ray` hits the ray at a given t value within
   * `tMax` and `tMin`. Returns undefined otherwise.
   */
  hit(ray: Ray, tMin: number, tMax: number): HitRecord | void;
}

export interface Material {
  scatter(ray: Ray, hitRecord: HitRecord): ScatterRecord | void;
}
