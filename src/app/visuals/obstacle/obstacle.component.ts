import { Component, Input } from '@angular/core';
import { Obstacle } from '../../interfaces/obstacle';
import { PositionService } from '../../services/position/position.service';
import { ParameterControlService } from 'src/app/services/parameter-controls/parameter.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[vdg-obstacle]',
  templateUrl: './obstacle.component.html',
  styleUrls: ['./obstacle.component.sass']
})
/**
 * Visual obstacle component
 */
export class ObstacleComponent {
  // tslint:disable-next-line: no-input-rename
  @Input('vdg-obstacle') obstacle: Obstacle;
  activateObstacles: boolean;
  offsetR: number;

  constructor(private readonly position: PositionService, private paramService: ParameterControlService) {
    paramService.obstacleOffsetSource$.subscribe(d => { this.offsetR = d; });
    this.paramService.activateObstaclesSource$.subscribe(d => { this.activateObstacles = d; });
  }

  /**
   * Transforms arena x-coordinate to respective x-coordinate in pixels
   * @param x x-coordinate in arena space
   */
  public X(x: number) {
    return this.position.PX(x);
  }

  /**
   * Transforms arena x-coordinate to respective y-coordinate in pixels
   * @param y y-coordinate in arena space
   */
  public Y(y: number) {
    return this.position.PY(y);
  }

  /**
   * Obstacle offset
   */
  public offset() {
    return this.position.PX(this.obstacle.offset * this.offsetR);
  }
}
