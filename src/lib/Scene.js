// @flow
import invariant from 'invariant';

import Camera from 'lib/Camera';
import Color from 'lib/Color';
import Group from 'lib/surfaces/Group';
import World from 'lib/World';
import Matrix from 'lib/Matrix';
import RTImage from 'lib/RTImage';
import type Ray from 'lib/Ray';
import type { HitRecord, Light, RenderableSurface } from 'lib/types';

type SceneConfig = {
  /** The camera used to render the scene */
  +camera?: Camera,

  /** Height of the rendered image */
  +height: number,

  /** Width of the rendered image */
  +width: number,

  /** Color to render if we don't hit any shapes */
  backgroundColor?: Color,

  /** The number of antialiasing samples to take is antialiasingFactor^2 */
  +antialiasingFactor?: number,
};

export default class Scene {
  static SHADING_DEPTH_LIMIT = 10;

  _world: World = new World();
  _lights: Array<Light> = [];
  _antialiasingFactor: number = 1;
  _camera: Camera = Camera.DEFAULT;
  _readyForRendering: boolean = false;
  _image: RTImage;
  _backgroundColor: Color;

  constructor({
    backgroundColor = new Color(0.02, 0.02, 0.02),
    camera = Camera.DEFAULT,
    antialiasingFactor = 1,
    ...imageConfig
  }: SceneConfig) {
    this._image = new RTImage(imageConfig);
    this._antialiasingFactor = antialiasingFactor;
    this._backgroundColor = backgroundColor;
    this.setCamera(camera);
  }

  backgroundColor(): Color {
    return this._backgroundColor;
  }

  camera(): Camera {
    return this._camera;
  }

  image(): RTImage {
    return this._image;
  }

  lights(): $ReadOnlyArray<Light> {
    return this._lights;
  }

  antialiasingFactor(): number {
    return this._antialiasingFactor;
  }

  setCamera(camera: Camera): Scene {
    this._camera = camera;
    const width = this._image.width();
    const height = this._image.height();
    const aspect = width / height;

    if (width > height) {
      camera.setViewWidth(1);
      camera.setViewHeight(1 / aspect);
    } else {
      camera.setViewHeight(1);
      camera.setViewWidth(aspect);
    }
    return this;
  }

  addLight(light: Light): Scene {
    this._lights.push(light);
    return this;
  }

  isReadyForRendering(): boolean {
    return this._readyForRendering;
  }

  addSurface(surface: RenderableSurface | Group): Scene {
    const id = Matrix.IDENTITY;
    if (surface instanceof Group) {
      const group = surface;
      group.setTransformation(id);
      group.forEachSurface(s => {
        this.addSurface(s);
      });
    } else {
      surface.setTransformation(id, id, id);
      this._world.addSurface(surface);
    }
    return this;
  }

  /**
   * Once all surfaces have been added, call this to set up the scene for
   * rendering.
   */
  finalizeSetup(): Scene {
    invariant(
      !this._readyForRendering,
      'Scene cannot be prepared for rendering twice.',
    );
    this._readyForRendering = true;
    return this._initializeAABB();
  }

  getAnyIntersection(ray: Ray): HitRecord | void {
    return this._world.getAnyIntersection(ray);
  }

  getClosestIntersection(ray: Ray): HitRecord | void {
    return this._world.getClosestIntersection(ray);
  }

  shadeRay(ray: Ray, depth?: number = 0): Color {
    // TODO: implement recursive raytracing (for reflective materials)
    // find the first intersection of the ray with the same
    const hitRecord = this.getClosestIntersection(ray);
    if (hitRecord === undefined) {
      // if there is no intersection between the ray and scene
      return this.backgroundColor();
    }

    return hitRecord.shader.shade(this, hitRecord, ray, depth);
  }

  /**
   * Initialize the AABB by retrieving a list of all surfaces from the scene.
   * Send the list to AABB and call createTree.
   * TODO: finish creating AABB data structure
   */
  _initializeAABB(): Scene {
    // AABB.createTree(0, allSurfaces.length);
    return this;
  }
}
