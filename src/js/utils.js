import { Vector3 } from 'three';

// Vector zero constant
export const VECTOR_ZERO = new Vector3();

/**
 * createCanvas
 * Create and return a canvas by width and height
 *
 * @export
 * @param {number} width
 * @param {number} height
 * @returns {object}
 */
export function createCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  return {
    ctx,
    canvas
  };
}

/**
 * spherePoint
 * Return a spherical point based on uv
 * https://stackoverflow.com/questions/5531827/random-point-on-a-given-sphere
 *
 * @export
 * @param {number} x0
 * @param {number} y0
 * @param {number} z0
 * @param {number} u
 * @param {number} v
 * @param {number} radius
 * @returns {object}
 */
export function spherePoint(x0, y0, z0, u, v, radius) {
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const x = x0 + radius * Math.sin(phi) * Math.cos(theta);
  const y = y0 + radius * Math.sin(phi) * Math.sin(theta);
  const z = z0 + radius * Math.cos(phi);
  return { x, y, z };
}
