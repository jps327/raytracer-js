// @flow
import Ray from 'lib/Ray';
import Vec3 from 'lib/Vec3';
import type { HitRecord, Hittable, Material } from 'lib/types';

export default class Sphere implements Hittable {
  _center: Vec3;
  _radius: number;
  _material: Material;

  constructor(center: Vec3, radius: number, material: Material) {
    this._center = center;
    this._radius = radius;
    this._material = material;
  }

  _makeHitRecord(ray: Ray, t: number): HitRecord {
    const p = ray.pointAtParameter(t);
    return {
      t,
      p,
      normal: p.subtract(this._center).scaleInverse(this._radius, 'm'),
      material: this._material,
    };
  }

  hit(ray: Ray, tMin: number, tMax: number): HitRecord | void {
    const oc = ray.origin().subtract(this._center);
    const a = ray.direction().dot(ray.direction());
    const b = oc.dot(ray.direction());
    const c = oc.dot(oc) - this._radius * this._radius;
    const discriminant = b * b - a * c;

    if (discriminant > 0) {
      let t = (-b - Math.sqrt(discriminant)) / a;
      if (t < tMax && t > tMin) {
        return this._makeHitRecord(ray, t);
      }

      // check the other possible solution for `t`
      t = (-b + Math.sqrt(discriminant)) / a;
      if (t < tMax && t > tMin) {
        return this._makeHitRecord(ray, t);
      }
    }

    return undefined;
  }
}
