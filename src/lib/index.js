// @flow
import invariant from 'invariant';

import App from 'lib/App';
import Camera from 'lib/Camera';
import Color from 'lib/Color';
import Dielectric from 'lib/Dielectric';
import HittableList from 'lib/HittableList';
import Lambertian from 'lib/Lambertian';
import Metal from 'lib/Metal';
import Ray from 'lib/Ray';
import Sphere from 'lib/Sphere';
import Stopwatch from 'lib/Stopwatch';
import Vec3 from 'lib/Vec3';
import type { Hittable } from 'lib/types';

const USE_ANTIALIASING = false;
const DEPTH_LIMIT = 10;
const NUM_ANTIALIASING_SAMPLES = 10;

const root = document.getElementById('root');
invariant(root, 'Root element must exist');

/**
 * Red, green, blue values must all be between 0 and 1
 */
function colorPixel(
  canvasImage: ImageData,
  x: number,
  y: number,
  color: Color,
): void {
  const pixelIdx = (y * canvasImage.width + x) * 4;
  canvasImage.data[pixelIdx] = Math.floor(color.r() * 255.99);
  canvasImage.data[pixelIdx + 1] = Math.floor(color.g() * 255.99);
  canvasImage.data[pixelIdx + 2] = Math.floor(color.b() * 255.99);
  canvasImage.data[pixelIdx + 3] = 255;
}

function linearBlend(startColor: Color, endColor: Color, t: number): Color {
  // blendedValue = (1 - t)*startValue + t*endValue
  return startColor.scale(1 - t).addScaled(t, endColor, 'm');
}

function color(r: Ray, world: Hittable, depth?: number = 0): Color {
  const hitRecord = world.hit(r, 0.001, Number.MAX_VALUE);

  if (hitRecord) {
    const scatterInfo = hitRecord.material.scatter(r, hitRecord);
    if (depth < DEPTH_LIMIT && scatterInfo) {
      const { attenuation, scatteredRay } = scatterInfo;
      return color(scatteredRay, world, depth + 1).multiply(attenuation, 'm');
    } else {
      return new Color(0, 0, 0);
    }
  }

  // gradient background for when we don't hit the sphere
  const unitDirection = r.direction().makeUnitVector();
  const t = 0.5 * (unitDirection.y() + 1);
  return linearBlend(new Color(1, 1, 1), new Color(0.5, 0.7, 1), t);
}

function makeRandomScene(): HittableList {
  const objList = [
    new Sphere(
      new Vec3(0, -1000, 0),
      1000,
      new Lambertian(new Color(0.5, 0.5, 0.5)),
    ),
  ];

  for (let a = -11; a < 11; a++) {
    for (let b = -11; b < 11; b++) {
      const chooseMaterial = Math.random();
      const center = new Vec3(
        a + 0.9 * Math.random(),
        0.2,
        b + 0.9 * Math.random(),
      );

      if (center.subtract(new Vec3(4, 0.2, 0)).length() > 0.9) {
        if (chooseMaterial < 0.8) {
          // choose diffuse
          objList.push(
            new Sphere(
              center,
              0.2,
              new Lambertian(
                new Color(Math.random(), Math.random(), Math.random()),
              ),
            ),
          );
        } else if (chooseMaterial < 0.95) {
          // choose metal
          objList.push(
            new Sphere(
              center,
              0.2,
              new Metal(
                new Color(
                  0.5 * (1 + Math.random()),
                  0.5 * (1 + Math.random()),
                  0.5 * (1 + Math.random()),
                ),
                0.5 * Math.random(),
              ),
            ),
          );
        } else {
          // choose glass
          objList.push(new Sphere(center, 0.2, new Dielectric(1.5)));
        }
      }
    }
  }

  objList.push(
    new Sphere(new Vec3(0, 1, 0), 1, new Dielectric(1.5)),
    new Sphere(new Vec3(-4, 1, 0), 1, new Lambertian(new Color(0.4, 0.2, 0.1))),
    new Sphere(new Vec3(4, 1, 0), 1, new Metal(new Color(0.7, 0.6, 0.5), 0)),
  );

  return new HittableList(objList);
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('width', String(width));
  canvas.setAttribute('height', String(height));

  const context = canvas.getContext('2d');
  const imageData = context.createImageData(width, height);

  // set up camera
  const lookFrom = new Vec3(13, 2, 3);
  const lookAt = new Vec3(0, 0, 0);
  const camera = new Camera({
    lookFrom,
    lookAt,
    vup: new Vec3(0, 1, 0),
    vfov: 20,
    aspect: width / height,
    aperture: 0.1,
    focusDistance: 10,
  });

  // set up world
  const objList = [
    new Sphere(
      new Vec3(0, 0, -1),
      0.5,
      new Lambertian(new Color(0.1, 0.2, 0.5)),
    ),
    new Sphere(
      new Vec3(0, -100.5, -1),
      100,
      new Lambertian(new Color(0.8, 0.8, 0)),
    ),
    new Sphere(
      new Vec3(1, 0, -1),
      0.5,
      new Metal(new Color(0.8, 0.6, 0.2), 0.3),
    ),
    new Sphere(new Vec3(-1, 0, -1), 0.5, new Dielectric(1.5)),

    // using a negative radius on a dielectric sphere doesn't change the
    // geometry, but it points the surface normal inwards, so it can be used
    // as a bubble to make a hollow glass sphere.
    new Sphere(new Vec3(-1, 0, -1), -0.45, new Dielectric(1.5)),
  ];
  const world = new HittableList(objList);

  // const world = makeRandomScene();

  console.time('raytrace');

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (USE_ANTIALIASING) {
        // anti-aliasing: take NUM_ANTIALIASING_SAMPLES amount of samples for
        // each pixel
        const col = new Color(0, 0, 0);
        Stopwatch.start('sampling');
        for (let s = 0; s < NUM_ANTIALIASING_SAMPLES; s++) {
          // create a ray that goes through this sub-sampled pixel
          const u = (x + Math.random()) / width;
          const v = (y + Math.random()) / height;
          Stopwatch.start('camera getRay');
          const ray = camera.getRay(u, v);
          Stopwatch.stop('camera getRay');

          Stopwatch.start('coloring');
          const newCol = color(ray, world);
          Stopwatch.stop('coloring');

          col.add(newCol, 'm');
        }
        Stopwatch.stop('sampling');

        // divide the final color by the amount of samples to get an average
        // color for this pixel
        col.scaleInverse(NUM_ANTIALIASING_SAMPLES, 'm');
        col.gamma2('m');
        colorPixel(imageData, x, height - y, col);
      } else {
        const u = x / width;
        const v = y / height;
        const ray = camera.getRay(u, v);
        const col = color(ray, world);
        col.gamma2('m');
        colorPixel(imageData, x, height - y, col);
      }
    }
  }

  if (USE_ANTIALIASING) {
    Stopwatch.print('sampling');
    Stopwatch.print('coloring');
    Stopwatch.print('camera getRay');
  }
  console.timeEnd('raytrace');
  context.putImageData(imageData, 0, 0);
  return canvas;
}

// root.appendChild(createCanvas(800, 200));
// root.appendChild(createCanvas(1200, 800));
root.appendChild(createCanvas(750, 500));

export default App;
