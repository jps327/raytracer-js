// @flow
import BaseSurface from 'lib/surfaces/BaseSurface';
import Color from 'lib/Color';
import Lambertian from 'lib/shaders/Lambertian';
import Vec3 from 'lib/Vec3';
import type Ray from 'lib/Ray';
import type { IHittable } from 'lib/surfaces/IHittable';
import type { IShader } from 'lib/shaders/IShader';
import type { HitRecord } from 'lib/types';

type SphereConfig = {
  +center?: Vec3,
  +radius?: number,
  +shader?: IShader,
};

export default class Sphere extends BaseSurface implements IHittable {
  _center: Vec3;
  _radius: number;

  constructor({
    center = new Vec3(0, 0, 0),
    radius = 1,
    shader = new Lambertian({ diffuseColor: Color.WHITE() }),
  }: SphereConfig) {
    super(shader);
    this._center = center;
    this._radius = radius;
  }

  // TODO: $AABBOptimization - implement this function
  computeBoundingBox(): void {
    return undefined;
  }

  _makeHitRecord(ray: Ray, t: number): HitRecord {
    const p = ray.pointAtParameter(t);
    const normal = p.subtract(this._center).scaleInverse(this._radius, 'm');
    return {
      t,
      p: this._tMat.rightMultiplyPoint(p, 'm'),
      normal: this._tMatTInv.rightMultiplyVector(normal, 'm').normalize('m'),
      shader: this._shader,
    };
  }

  hit(r: Ray): HitRecord | void {
    const ray = this.untransformRay(r);
    const rayDirection = ray.direction();

    const oc = ray.origin().subtract(this._center);
    const a = rayDirection.dot(rayDirection);
    const b = oc.dot(rayDirection);
    const c = oc.dot(oc) - this._radius * this._radius;
    const discriminant = b * b - a * c;

    if (discriminant > 0) {
      var t1 = (-b + Math.sqrt(discriminant)) / a;
      var t2 = (-b - Math.sqrt(discriminant)) / a;

      if (ray.isValidTParam(t1) && ray.isValidTParam(t2)) {
        return this._makeHitRecord(ray, Math.min(t1, t2));
      } else if (ray.isValidTParam(t1)) {
        return this._makeHitRecord(ray, t1);
      } else {
        return this._makeHitRecord(ray, t2);
      }
    }
    return undefined;
  }
}
