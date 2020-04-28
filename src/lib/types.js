// @flow
import type BaseSurface from 'lib/surfaces/BaseSurface';
import type Color from 'lib/Color';
import type Ray from 'lib/Ray';
import type Vec3 from 'lib/Vec3';
import type Matrix from 'lib/Matrix';
import type { IHittable } from 'lib/surfaces/IHittable';
import type { IShader } from 'lib/shaders/IShader';
import type { ITransformable } from 'lib/surfaces/ITransformable';

/**
 * A light is represented by a position vector, and the intensity of the light
 * (which is represented by a color)
 */
export type Light = {
  +position: Vec3,
  +intensity: Color,
};

/**
 * This record holds a bunch of information about a ray's intersection with
 * a Hittable surface.
 */
export type HitRecord = {
  /** The `t` value at which the ray intersects with a Hittable surface */
  +t: number,

  /** The point at which the ray intersects with a Hittable surface */
  +p: Vec3,

  /**
   * The normal at the point where we hit a Hittable surface.
   * The normal is expected to be a unit vector.
   * */
  +normal: Vec3,

  /** The material of the surface we hit */
  +shader: IShader,
};

export type RenderableSurface = BaseSurface & ITransformable & IHittable;
