// @flow
import Vec3 from 'lib/Vec3';

/**
 * Create a random point in a unit sphere. We do this by randomly generating
 * a point until we get one that lies in the unit sphere. The test for this is
 * simple: check if the squared length is less than 1.
 */
// TODO: safe to remove?
export function randomPointInUnitSphere(): Vec3 {
  let p: Vec3;
  do {
    p = new Vec3(
      2 * Math.random() - 1,
      2 * Math.random() - 1,
      2 * Math.random() - 1,
    );
  } while (p.squaredLength() >= 1);
  return p;
}

/**
 * Create a random point in a unit disk.
 */
// TODO: safe to remove?
export function randomPointInUnitDisk(): Vec3 {
  let p: Vec3;
  do {
    p = new Vec3(2 * Math.random() - 1, 2 * Math.random() - 1, 0);
  } while (p.squaredLength() >= 1);
  return p;
}
