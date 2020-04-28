// @flow
import Ray from 'lib/Ray';
import type { HitRecord, RenderableSurface } from 'lib/types';

// TODO: change this to use an Axis-Aligned Bounding-Box data structure
export default class World {
  _hittables: Array<RenderableSurface> = [];
  _left: number = 0;
  _right: number = 0;

  addSurface(surface: RenderableSurface): void {
    this._hittables.push(surface);
    this._right = this._hittables.length;
  }

  /**
   * Returns the first intersection of a ray with a list of surfaces.
   * If 'useAny' is true then we jsut return the first intersection with any
   * surface. If it is false then we return the closest intersection.f
   */
  getFirstIntersection(ray: Ray, useAny: boolean): HitRecord | void {
    const newRay = ray.clone();
    let hitRecordResult = undefined;

    for (let i = this._left; i < this._right; i++) {
      const hitRecord = this._hittables[i].hit(newRay);
      if (hitRecord !== undefined && hitRecord.t < newRay.tMax()) {
        if (useAny) {
          return hitRecord;
        }

        newRay.setTMax(hitRecord.t);
        hitRecordResult = hitRecord;
      }
    }
    return hitRecordResult;
  }

  getClosestIntersection(ray: Ray): HitRecord | void {
    return this.getFirstIntersection(ray, false);
  }

  getAnyIntersection(ray: Ray): HitRecord | void {
    return this.getFirstIntersection(ray, true);
  }
}
