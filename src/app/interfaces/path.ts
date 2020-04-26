import { Output } from '@angular/core';
import Segment from './segment';

/**
 * Path properties having id, radius and segments
 */
export class Path {

    @Output() public segments: Segment[];

    id: number;

    // path thickness
    radius = 30;

    // passing radius
    passingRadius: number;


    constructor(id: number, segments: Segment[]) {
        this.id = id;
        this.segments = segments;
    }

    /**
     * Set path radius
     * @param r path radius
     */
    setRadius(r: number) {
        console.log(`old radius ${this.radius}, new radius ${r}`);
        this.radius = r;
    }

    /**
     * Remove path from list
     * @param id path id
     */
    remove(id: number) {
        this.segments.splice(id, 1);
    }
}
