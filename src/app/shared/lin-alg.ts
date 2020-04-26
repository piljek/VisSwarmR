import * as d3 from 'd3';
import Vector from 'ts-vector';

/**
 * Helper class for linear algebraic calculations
 */
export class LinA {

    /**
     * Translate degrees to radians. Transformation from rotation angle to position.
     * 180 degree = pi radians
     */
    static deg2rad: any = d3.scaleLinear().domain([0, 360]).range([0, 2 * Math.PI]);

    /**
     * Translate radians to degrees. Determine degree of rotation from position.
     */
    static rad2deg = d3.scaleLinear().range([0, 360]).domain([0, 2 * Math.PI]);

    /**
     * Returns always a positive angle in degrees (0-360)
     * @param deg possible negative degree
     */
    static posDegree(deg: number) {
        let d = deg % 360;
        // console.log(`d % 360 --> ${d}`)
        if (d < 0) {
            d += 360;
            // console.log(`d negative --> ${d}`)
        } else if (d > 360) {
            d -= 360;
            console.log(`d too big 360 --> ${d}`);
        }
        return d;
    }

    /**
     * Returns x position based on angle theta
     * @param theta turning angle in degrees
     */
    static tx(theta: number) {
        // return LinA.cos[theta.toFixed(0)];
        return Math.cos(this.deg2rad(theta));
    }

   /**
    * Returns y position based on angle theta
    * @param theta turning angle in degrees
    */
    static ty(theta: number) {
        return Math.sin(this.deg2rad(theta));
    }

    /**
     * Returns angle theta of x and y position of object. Returning values ranges from -pi to pi.
     * The first parameter is the x-coordinate and the second one is the y-position.
     * @param tx x-position of target angle
     * @param ty y-position of target angle
     */
    static targetDirection(tx: number, ty: number): number {
        return Math.atan2(ty, tx);
    }

    /**
     * Returns angle between two vectors and converts it from radians to degrees
     * @param v1 Vector v1
     * @param v2 Vector v2
     */
    static angleBetweenVectorsDegree(v1: Vector, v2: Vector) {
        return this.rad2deg(this.angleBetweenVectorsRad(v1, v2));
        // let angle = this.rad2deg(Math.acos(v1.dot(v2) / (v1.magnitude() * v2.magnitude())))
        // return angle === undefined ? 0 : angle;
    }

    /**
     * Returns angle between two vectors and converts it from radians to degrees
     * @param v1 Vector v1
     * @param v2 Vector v2
     */
    static angleBetweenVectorsRad(v1: Vector, v2: Vector) {
        const angle = Math.acos(v1.dot(v2) / (v1.magnitude() * v2.magnitude()));
        return angle === undefined ? 0 : angle;
    }

  /**
   * Calculates the euclidean distance between two points. Put first x-coordinates, then y-coordinates into method call.
   * @param x1 x-coordinate first point
   * @param x2 x-coordinate second point
   * @param y1 y-coordinate first point
   * @param y2 y-coordinate second point
   */
    public static euclideanDist(x1: number, x2: number, y1: number, y2: number): number {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }
}
