// @flow
import Color from 'lib/Color';
import HitRecordUtil from 'lib/HitRecordUtil';
import type Ray from 'lib/Ray';
import type Scene from 'lib/Scene';
import type { HitRecord } from 'lib/types';
import type { IShader } from 'lib/shaders/IShader';

type PhongConfig = {
  diffuseColor: Color,
  specularColor: Color,
  exponent: number,
};

export default class Phong implements IShader {
  _diffuseColor: Color;
  _specularColor: Color;
  _exponent: number;

  constructor({ diffuseColor, specularColor, exponent }: PhongConfig) {
    this._diffuseColor = diffuseColor;
    this._specularColor = specularColor;
    this._exponent = exponent;
  }

  shade(scene: Scene, hitRecord: HitRecord, ray: Ray): Color {
    const color = Color.BLACK();
    const toEye = HitRecordUtil.getVectorToEye(hitRecord, ray);
    scene.lights().forEach(light => {
      if (!HitRecordUtil.isShadowed(hitRecord, light, scene)) {
        // get light direction
        const l = HitRecordUtil.getVectorToLight(hitRecord, light);

        // get half-vector
        const h = toEye.add(l).normalize('m');

        // get normal
        const n = hitRecord.normal;

        // calculate color
        const specular = light.intensity
          .multiply(this._specularColor)
          .scale(Math.pow(Math.max(0, h.dot(n)), this._exponent), 'm');
        const diffuse = light.intensity
          .multiply(this._diffuseColor)
          .scale(Math.max(0, n.dot(l)), 'm');

        color.add(specular, 'm').add(diffuse, 'm');
      }
    });

    return color;
  }
}
