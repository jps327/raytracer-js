// @flow
import invariant from 'invariant';

import App from 'lib/App';
import Camera from 'lib/Camera';
import Color from 'lib/Color';
import Lambertian from 'lib/shaders/Lambertian';
import Phong from 'lib/shaders/Phong';
import Scene from 'lib/Scene';
import Sphere from 'lib/surfaces/Sphere';
import Stopwatch from 'lib/Stopwatch';
import Vec3 from 'lib/Vec3';

const root = document.getElementById('root');
invariant(root, 'Root element must exist');

/**
 * Shoot a ray through this pixel and return a color.
 * @param {Scene} scene The scene we are rendering
 * @param {number} x The x coordinate of the pixel we're rendering
 * @param {number} y The y coordinate of the pizel we're rendering
 */
function _renderPixel(scene: Scene, x: number, y: number): Color {
  const image = scene.image();
  const camera = scene.camera();
  const l = camera.left();
  const r = camera.right();
  const b = camera.bottom();
  const t = camera.top();
  const nx = image.width();
  const ny = image.height();
  const ns = scene.antialiasingFactor();

  const finalColor = new Color(0, 0, 0);
  for (let dx = -(ns - 1) / 2; dx <= (ns - 1) / 2; dx++) {
    for (let dy = -(ns - 1) / 2; dy <= (ns - 1) / 2; dy++) {
      const ix = x + dx / ns;
      const iy = y + dy / ns;
      const u = l + ((r - l) * (ix + 0.5)) / nx;
      const v = b + ((t - b) * (iy + 0.5)) / ny;
      const ray = camera.getRay(u, v);
      const color = scene.shadeRay(ray);
      finalColor.add(color, 'm');
    }
  }

  return finalColor
    .scale(1 / (ns * ns), 'm')
    .gammaCorrect(2.2, 'm')
    .clampColor('m');
}

function renderImage(scene: Scene) {
  const image = scene.image();
  const nx = image.width();
  const ny = image.height();

  for (let y = 0; y < ny; y++) {
    for (let x = 0; x < nx; x++) {
      const color = _renderPixel(scene, x, y);
      image.setPixel(x, ny - y, color);
    }
  }

  return image.repaint();
}

const BASIC_LAMBERTIAN_SCENE = new Scene({
  camera: Camera.DEFAULT,
  width: 800,
  height: 400,
  antialiasingFactor: 2,
})
  .addLight({ position: new Vec3(-2, 3, 1), intensity: new Color(1, 1, 1) })
  .addSurface(
    new Sphere({
      center: new Vec3(0, 0, -5),
      radius: 1,
      shader: new Lambertian({ diffuseColor: Color.YELLOW() }),
    }),
  )
  .finalizeSetup();

const MULTI_SPHERE_SCENE = new Scene({
  camera: Camera.DEFAULT,
  backgroundColor: new Color(0.5, 0.7, 1),
  width: 800,
  height: 400,
  antialiasingFactor: 1,
})
  .addLight({ position: new Vec3(-2, 3, 1), intensity: new Color(1, 1, 1) })
  .addSurface(
    new Sphere({
      center: new Vec3(-1.5, 0, -7),
      radius: 1,
      shader: new Lambertian({ diffuseColor: Color.YELLOW() }),
    }),
  )
  .addSurface(
    new Sphere({
      center: new Vec3(1.5, 0, -7),
      radius: 1,
      shader: new Phong({
        diffuseColor: Color.BLUE(),
        specularColor: new Color(0, 1, 1),
        exponent: 100,
      }),
    }),
  )
  .addSurface(
    new Sphere({
      center: new Vec3(0, 0, -8),
      radius: 0.5,
      shader: new Phong({
        diffuseColor: Color.BLUE(),
        specularColor: new Color(0, 1, 1),
        exponent: 100,
      }),
      /*
      shader: new Metal({
        albedo: Color.BLUE(),
        fuzziness: 0.5,
      }),
      */
    }),
  )
  .finalizeSetup();

const SCENE_TO_RENDER = MULTI_SPHERE_SCENE;

Stopwatch.start('raytrace');
root.appendChild(renderImage(SCENE_TO_RENDER).canvas());
Stopwatch.stop('raytrace');
Stopwatch.print('raytrace');

export default App;
