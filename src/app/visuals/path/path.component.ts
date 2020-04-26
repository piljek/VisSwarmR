import { Component, Input, Output } from '@angular/core';
import { Path } from '../../interfaces/path';
import { PositionService } from '../../services/position/position.service';
import Segment from '../../interfaces/segment';
import * as d3 from 'd3';
import { ParameterControlService } from 'src/app/services/parameter-controls/parameter.service';
import { ParameterControlPathService } from 'src/app/services/parameter-controls/path/path-controls.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[vdg-path]',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.sass']
})
/**
 * Visual path component
 */
export class PathComponent {

  constructor(private readonly position: PositionService, private readonly paramControlService: ParameterControlService,
              private readonly pathParamService: ParameterControlPathService) {
    PathComponent.paramService = pathParamService;
    this.subscribe();
  }

  static paramService: ParameterControlPathService;
  // tslint:disable-next-line: no-input-rename
  @Input('vdg-path') path: Path;

  @Output() segments: Segment[];

  debugPathFollowingVis: boolean;
  debug: boolean;
  activate: boolean;

  /**
   * Subscribe to parameter controls
   */
  subscribe() {
    this.paramControlService.debugSource$.subscribe(d => { this.debug = d; });
    this.paramControlService.debugPathFollowingSource$.subscribe(d => { this.debugPathFollowingVis = d; });

    // // activate path following
    this.pathParamService.activateSource$.subscribe(d => { this.activate = d; });
  }

  /**
   * Transforms arena x-coordinate to respective x-coordinate in pixels
   * @param x x-coordinate in arena space
   */
  public X(x: number) {
    return this.position.PX(x);
  }

  /**
   * Transforms arena y-coordinate to respective y-coordinate in pixels
   * @param y y-coordinate in arena space
   */
  public Y(y: number) {
    return this.position.PY(y);
  }

  /**
   * Draw path as catmull rom curve
   */
  d3CurveCatmullRom() {
    const path: [number, number][] = new Array();
    const line = d3.line().x(d => d[0]).y(d => d[1]).curve(d3.curveCatmullRom.alpha(0.5));
    // const line = d3.line().x(function(d) { return d[0]; }).y(function(d) { return d[1]; }).curve(d3.curveCatmullRom.alpha(0.5));


    const startSegment = this.path.segments[0].start;
    path.push([this.X(startSegment[0]), this.Y(startSegment[1])]);

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.path.segments.length; i++) {
      const segment = this.path.segments[i].end;
      path.push([this.X(segment[0]), this.Y(segment[1])]);
    }

    return line(path);

  }

  /**
   * Draw debug path
   */
  d3pathLine() {


    const path: [number, number][] = new Array();
    const line = d3.line().x(d => d[0]).y(d => d[1]);


    const startSegment = this.path.segments[0].start;
    path.push([this.X(startSegment[0]), this.Y(startSegment[1])]);

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.path.segments.length; i++) {
      const segment = this.path.segments[i].end;
      path.push([this.X(segment[0]), this.Y(segment[1])]);
    }

    return line(path);

  }

}
