// @flow
import Ray from 'lib/Ray';
import type { HitRecord, Hittable } from 'lib/types';

export default class HittableList implements Hittable {
  _hittables: $ReadOnlyArray<Hittable>;

  constructor(hittables: $ReadOnlyArray<Hittable>) {
    this._hittables = hittables;
  }

  hit(ray: Ray, tMin: number, tMax: number): HitRecord | void {
    let hitRecord = undefined;
    let closestTSofar = tMax;
    const numObjects = this._hittables.length;
    for (let i = 0; i < numObjects; i++) {
      const hittableObj = this._hittables[i];
      const newHit = hittableObj.hit(ray, tMin, closestTSofar);
      if (newHit) {
        closestTSofar = newHit.t;
        hitRecord = newHit;
      }
    }
    return hitRecord;
  }
}
