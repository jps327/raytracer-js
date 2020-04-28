// @flow
import type Ray from 'lib/Ray';
import type { HitRecord } from 'lib/types';

export interface IHittable {
  /**
   * Returns a HitRecord if the `ray` hits the Hittable surface.
   * Returns undefined otherwise.
   */
  hit(ray: Ray): HitRecord | void;
}
