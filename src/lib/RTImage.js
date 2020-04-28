// @flow
import invariant from 'invariant';

import type Color from 'lib/Color';

type RayTracerImageConfig =
  | { width: number, height: number }
  | { canvasId: string };

/**
 * RayTracer Image class (not to be confused with JavaScript's built-in Image
 * class). This data structure holds the image information for a canvas element.
 */
export default class RTImage {
  _width: number;
  _height: number;
  _canvasElement: HTMLCanvasElement;
  _context: CanvasRenderingContext2D;
  _imageData: ImageData;

  constructor(config: RayTracerImageConfig) {
    if (config.canvasId !== undefined) {
      const { canvasId } = config;
      const canvasEl = document.getElementById(canvasId);
      invariant(
        canvasEl !== null && canvasEl instanceof HTMLCanvasElement,
        'Canvas element does not exist',
      );
      this._canvasElement = canvasEl;
    } else {
      const { width, height } = config;
      const canvasEl = document.createElement('canvas');
      canvasEl.setAttribute('width', String(width));
      canvasEl.setAttribute('height', String(height));
      this._canvasElement = canvasEl;
    }

    this._context = this._canvasElement.getContext('2d');
    this._width = this._canvasElement.width;
    this._height = this._canvasElement.height;
    this._imageData = this._context.createImageData(this._width, this._height);
  }

  width(): number {
    return this._width;
  }

  height(): number {
    return this._height;
  }

  canvas(): HTMLCanvasElement {
    return this._canvasElement;
  }

  repaint(): RTImage {
    this._context.putImageData(this._imageData, 0, 0);
    return this;
  }

  setPixel(x: number, y: number, color: Color): RTImage {
    const i = (x + y * this._imageData.width) * 4;
    this._imageData.data[i] = color.r() * 255;
    this._imageData.data[i + 1] = color.g() * 255;
    this._imageData.data[i + 2] = color.b() * 255;
    this._imageData.data[i + 3] = 255; // alpha channel, 255=opaque
    return this;
  }
}
