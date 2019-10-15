/**
 *
 *
 * @export
 * @param {*} params
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
 *
 *
 * @export
 * @param {*} x0
 * @param {*} y0
 * @param {*} z0
 * @param {*} u
 * @param {*} v
 * @param {*} radius
 * @returns
 */
export function spherePoint(x0, y0, z0, u, v, radius) {
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const x = x0 + radius * Math.sin(phi) * Math.cos(theta);
  const y = y0 + radius * Math.sin(phi) * Math.sin(theta);
  const z = z0 + radius * Math.cos(phi);
  return { x, y, z };
}
