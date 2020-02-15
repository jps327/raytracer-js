// @flow
import invariant from 'invariant';

import Color from 'lib/Color';
import Ray from 'lib/Ray';
import type { HitRecord, Material, ScatterRecord } from 'lib/types';

function schlick(cosine: number, refractiveIndex: number): number {
  const r0 = (1 - refractiveIndex) / (1 + refractiveIndex);
  const r0sq = r0 * r0;
  return r0sq + (1 - r0sq) * Math.pow(1 - cosine, 5);
}

export default class Dielectric implements Material {
  _refractiveIndex: number;

  constructor(refractiveIndex: number) {
    this._refractiveIndex = refractiveIndex;
  }

  scatter(ray: Ray, hitRecord: HitRecord): ScatterRecord | void {
    const { normal, p } = hitRecord;
    const rayDir = ray.direction();
    const rayDirLength = rayDir.length();

    let refractiveIndexRatio;
    let outwardNormal;
    let cosine;
    const rayDotNormal = rayDir.dot(normal);
    if (rayDotNormal > 0) {
      refractiveIndexRatio = this._refractiveIndex;
      outwardNormal = normal.scale(-1);
      cosine = (refractiveIndexRatio * rayDotNormal) / rayDirLength;
    } else {
      refractiveIndexRatio = 1 / this._refractiveIndex;
      outwardNormal = normal;
      cosine = -rayDotNormal / rayDirLength;
    }

    // attenuation will always be 1 - a glass surface absorbs nothing.
    const attenuation = new Color(1, 1, 1);
    const refracted = rayDir.refract(outwardNormal, refractiveIndexRatio);
    const reflectProbability =
      refracted !== undefined ? schlick(cosine, this._refractiveIndex) : 1;

    if (Math.random() < reflectProbability) {
      const reflected = rayDir.reflect(normal);
      return { attenuation, scatteredRay: new Ray(p, reflected) };
    } else {
      invariant(refracted, 'Refracted ray must exist');
      return { attenuation, scatteredRay: new Ray(p, refracted) };
    }
  }
}
