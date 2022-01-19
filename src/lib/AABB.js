// @flow
import type Vec3 from 'lib/Vec3';

/**
 * Axis-Aligned Bounding Box to speed up the intersection look up time.
 */
class AABB {
  /**
   * The current bounding box for this tree node.
   * The bounding box is described by
   *   (minPt.x, minPt.y, minPt.z) - (maxBound.x, maxBound.y, maxBound.z).
   */
  minBound: Vec3;
  maxBound: Vec3;

  /**
   * `children` is a tuple of a left AABB node and a right AABB node:
   *   [left, right]
   */
  children: [AABB, AABB];
}
