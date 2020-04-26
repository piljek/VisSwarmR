import Vector from 'ts-vector';

/**
 * Path segment. Segment has id, start and end, and a unit vector
 */
export default class Segment {

    id: number;
    start: Vector;
    end: Vector;
    unitVec: Vector;

    constructor(id: number, start: Vector, end: Vector) {
        this.id = id;
        this.start = start;
        this.end = end;
        this.unitVec = this.end.subtract(this.start).normalizeVector();
    }
}
