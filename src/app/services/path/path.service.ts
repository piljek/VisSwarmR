import { Injectable } from '@angular/core';
import { Path } from '../../interfaces/path';
import Vector from 'ts-vector';
import Segment from '../../interfaces/segment';
import { ParameterControlPathService } from '../parameter-controls/path/path-controls.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Creates paths
 */
export class PathService {

  private paths: Path[];

  constructor(private pathParamService: ParameterControlPathService) {
    this.paths = new Array();

    const p1 = this.createPath1();
    this.paths.push(p1);

    const p2 = this.createPath2();
    this.paths.push(p2);

    const p3 = this.createPath3();
    this.paths.push(p3);

    this.subscribe();
  }

  /**
   * Subscribe to path parameter controls
   */
  subscribe() {
    /** path radius has changed */
    this.pathParamService.pathRadiusSource$.subscribe(d => {
      this.paths.forEach(path => {
        path.radius = d;
      });
    });

    /** segment radius has changed */
    this.pathParamService.segmentRadiusSource$.subscribe(d => {
      this.paths.forEach(path => {
        path.passingRadius = d;
      });
    });
  }

  /**
   * Gets defined paths
   */
  public getPaths(): Path[] {
    if (this.paths === null) {
      console.log('paths are null');
    }
    return this.paths;
  }

  public getPath(id: number) {
    return this.paths[id];
  }

  /**
   * Connects list of points to path and segments path
   * @param points list of path points
   */
  public createSegments(points: Vector[]) {
    const segments = new Array();
    let index = 0;
    for (let i = 0; i < points.length; i++) {
      const p0 = points[i % points.length];
      const p1 = points[(i + 1) % points.length];
      // console.log(`points: ${index}, p0: ${p0}, p1: ${p1}`);
      const s = new Segment(index, p0, p1);
      segments.push(s);
      index++;
    }
    return segments;
  }

  /**
   * Path 1: Creation
   */
  public createPath1() {
    const points = new Array();

    points.push(new Vector(150, 400));
    points.push(new Vector(400, 450));
    points.push(new Vector(550, 500));
    points.push(new Vector(950, 150));
    points.push(new Vector(1100, 450));
    points.push(new Vector(950, 500));
    points.push(new Vector(800, 450));
    points.push(new Vector(680, 200));
    points.push(new Vector(400, 100));

    return new Path(0, this.createSegments(points));
  }
  /**
   * Path 2: Creation
   */
  public createPath2() {

    const points = new Array();

    points.push(new Vector(150, 150));
    points.push(new Vector(600, 130));
    points.push(new Vector(1000, 100));
    points.push(new Vector(800, 500));
    points.push(new Vector(400, 450));
    points.push(new Vector(200, 400));

    this.createSegments(points);
    return new Path(1, this.createSegments(points));

  }

  /**
   * Path 1: Creation
   */
  public createPath3() {

    const points = new Array();

    points.push(new Vector(100, 700));
    points.push(new Vector(1000, 700));
    points.push(new Vector(1000, 100));
    points.push(new Vector(100, 100));
    // points.push(new Vector(400, 450))
    // points.push(new Vector(200, 400));

    this.createSegments(points);
    return new Path(2, this.createSegments(points));

  }

}


