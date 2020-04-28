// @flow
import type Color from 'lib/Color';
import type Ray from 'lib/Ray';
import type Scene from 'lib/Scene';
import type { HitRecord, Light } from 'lib/types';

export interface IShader {
  /**
   * Calculate the color at the given intersection represented by the hitRecord.
   * @param {Scene} scene The scene for the entire ray tracer image
   * @param {HitRecord} hitRecord The information representing the intersection
   * with the surface.
   * @param {Ray} ray A vector pointing to the camera eye
   * @param {number} depth The recursion depth to prevent reflecting too much
   * (for performance reasons)
   */
  shade(scene: Scene, hitRecord: HitRecord, ray: Ray, depth: number): Color;
}
