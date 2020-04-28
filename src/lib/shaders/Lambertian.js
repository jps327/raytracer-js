// @flow
import Color from 'lib/Color';
import HitRecordUtil from 'lib/HitRecordUtil';
import type Ray from 'lib/Ray';
import type Scene from 'lib/Scene';
import type { HitRecord } from 'lib/types';
import type { IShader } from 'lib/shaders/IShader';

type LambertianConfig = {
  diffuseColor: Color,
};

export default class Lambertian implements IShader {
  _diffuseColor: Color;

  constructor({ diffuseColor }: LambertianConfig) {
    this._diffuseColor = diffuseColor;
  }

  shade(scene: Scene, hitRecord: HitRecord, ray: Ray): Color {
    const color = Color.BLACK();
    scene.lights().forEach(light => {
      if (!HitRecordUtil.isShadowed(hitRecord, light, scene)) {
        // get light direction
        const l = HitRecordUtil.getVectorToLight(hitRecord, light);

        // ld = kd * I * max(0, n.l)
        const ld = this._diffuseColor
          .multiply(light.intensity)
          .scale(Math.max(0, hitRecord.normal.dot(l)), 'm');
        color.add(ld, 'm');
      }
    });
    return color;
  }
}
