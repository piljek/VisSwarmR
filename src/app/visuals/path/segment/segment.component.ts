import { Component, Input } from '@angular/core';
import Segment from '../../../interfaces/segment';
import { PositionService } from '../../../services/position/position.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[vdg-segment]',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.sass']
})
/**
 * Visual segments
 */
export class SegmentComponent {
  // tslint:disable-next-line: no-input-rename
  @Input('vdg-segment') segment: Segment;

  constructor(private readonly position: PositionService) { }
  /**
   * Transforms arena x-coordinate to respective x-coordinate in pixels
   * @param x x-coordinate in arena space
   */
  PX(x: number) {
    return this.position.PX(x);
  }

  /**
   * Transforms arena x-coordinate to respective y-coordinate in pixels
   * @param y y-coordinate in arena space
   */
  PY(y: number) {
    return this.position.PY(y);
  }


}
