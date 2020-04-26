import { Component, Input } from '@angular/core';
import * as d3 from 'd3';
import { PositionService } from 'src/app/services/position/position.service';
import { Mover } from 'src/app/interfaces/mover';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[vdg-mover]',
  templateUrl: './mover.component.html',
  styleUrls: ['./mover.component.sass']
})
/**
 * Visual mover component
 */
export class MoverComponent {
  // tslint:disable-next-line: no-input-rename
  @Input('vdg-mover') mover: Mover;


  constructor(private readonly position: PositionService) { }

  /**
   * Transforms arena x-coordinate to respective y-coordinate in pixels
   * @param x x-coordinate in arena space
   */
  get PX() {
    // console.log("sx: " + this.mover.sx)
    return this.position.PX(this.mover.sx);
  }

  /**
   * Transforms arena x-coordinate to respective y-coordinate in pixels
   * @param y y-coordinate in arena space
   */
  get PY() {
    // console.log("sy: " + this.mover.sy)
    return this.position.PY(this.mover.sy);
  }

  /**
   * Visualizes shaped form
   */
  get bodyForm() {
    const agentSize = this.mover._body_size;
    const line = d3.line().x(d => agentSize * d[0]).y(d => agentSize * d[1]);
    // const line = d3.line().x(function(d) { return agentSize * d[0]; }).y(function(d) { return agentSize * d[1]; });

    const path: [number, number][] = new Array();

    const M = 25;

    for (let i = 0; i < M; i++) {
      const x = -2 * Math.cos(i / M * Math.PI * 2);
      const y = Math.sin(i / M * Math.PI * 2) * Math.pow(Math.sin(i / M / 2 * Math.PI * 2), 6);
      path.push([x, y]);

    }

    return line(path);
  }

}
