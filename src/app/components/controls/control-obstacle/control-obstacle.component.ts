import { Component, OnInit, Output } from '@angular/core';
import { ParameterControlService } from 'src/app/services/parameter-controls/parameter.service';
import { MatSliderChange, MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'vdg-control-obstacle',
  templateUrl: './control-obstacle.component.html',
  styleUrls: ['./control-obstacle.component.sass']
})
/**
 * Obstacle parameters in parameters control
 */
export class ControlObstacleComponent implements OnInit {

  @Output() modelSelection: string;
  @Output() obstacleOffset: number;
  @Output() borderOffset: number;
  @Output() activateObstacles: boolean;

  constructor(private paramService: ParameterControlService) {
    this.paramService.modelSource$.subscribe(d => { this.modelSelection = d; });
    this.paramService.activateObstaclesSource$.subscribe(d => { this.activateObstacles = d; });
    this.paramService.obstacleOffsetSource$.subscribe(d => { this.obstacleOffset = d; });
    this.paramService.borderOffsetSource$.subscribe(d => { this.borderOffset = d; });
  }

  ngOnInit() {
  }


  /**
   * Second panel: Collision Avoidance Behavior.
   * Obstacle offset parameter changed
   * @param $event obstacleOffset
   */
  obstacleOffsetChanged($event: MatSliderChange) {
    this.paramService.obstacleOffsetChanged($event.value);
  }

  /**
   * Second panel: Collision Avoidance Behavior.
   * Border offset parameter changed
   * @param $event borderOffset
   */
  borderOffsetChanged($event: MatSliderChange) {
    this.paramService.borderOffsetChanged($event.value);
  }

  /**
   * Debug obstacle offset parameter
   * @param $event boolean
   */
  obstacleOffsetDebugged($event: MatSlideToggleChange) {
    this.paramService.obstacleOffsetDebugged($event.checked);
  }


  /**
   * Debug border offset parameter
   * @param $event boolean
   */
  borderOffsetDebugged($event: MatSlideToggleChange) {
    this.paramService.borderOffsetDebugged($event.checked);
  }

  /**
   * Activate obstacle avoidance
   * @param $event Toggle event
   */
  activate($event: MatSlideToggleChange) {
    this.paramService.activateObstacles(false);
    this.paramService.activateObstacles($event.checked);
  }

}
