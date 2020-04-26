import { Component, OnInit, Output } from '@angular/core';
import { MatSlideToggleChange, MatSliderChange } from '@angular/material';
import { ParameterControlPathService } from '../../../services/parameter-controls/path/path-controls.service';
import { ParameterControlService } from 'src/app/services/parameter-controls/parameter.service';

@Component({
  selector: 'vdg-control-path',
  templateUrl: './control-path.component.html',
  styleUrls: ['./control-path.component.sass']
})
/**
 * Path parameters in parameters control
 */
export class ControlPathComponent implements OnInit {
  @Output() modelSelection: string;
  @Output() _activate: boolean;
  @Output() radius: number;
  @Output() segmentRadius: number;
  @Output() pathId: number;

  startingSegments = [[0, 'Segment 0'], [1, 'Closest Segment']];
  startingSegment = this.startingSegments[1];


  constructor(private readonly pathParamService: ParameterControlPathService,
              private paramService: ParameterControlService) { }

  ngOnInit() {
    this.subscribe();
  }

  /**
   * Subscribe to parameter in path navigation service and component
   * Register changes
   */
  subscribe() {

    this.paramService.modelSource$.subscribe(d => { this.modelSelection = d; });

    this.pathParamService.activateSource$.subscribe(d => { this._activate = d; });
    this.pathParamService.pathRadiusSource$.subscribe(d => { this.radius = d; });
    this.pathParamService.segmentRadiusSource$.subscribe(d => { this.segmentRadius = d; });
    this.pathParamService.selectedPathSource$.subscribe(d => { this.pathId = d; });
  }

  /**
   * Toggle path following. When activated, path is set and mover will follow according to their behavioral model.
   * @param $event Toggle event
   */
  activate($event: MatSlideToggleChange) {
    // Deactive pathFollowing debug when path following is deactivated
    this.paramService.pathFollowingDebugged(false);
    this.pathParamService.activate($event.checked);
  }

  /**
   * Change path radius
   * @param $event radius size
   */
  pathRadiusChanged($event: MatSliderChange) {
    this.pathParamService.pathRadiusChanged($event.value);
  }

  /**
   * Change segment radius that movers must pass when segment is passed
   * @param $event radius size
   */
  segmentRadiusChanged($event: MatSliderChange) {
    this.pathParamService.segmentRadiusChanged($event.value);
  }

  /**
   * Select path
   * @param id path id
   */
  selectPath(id: number) {
    if (Number.isNaN(id) || id < 0) {
      id = 0;
    }
    this.pathParamService.selectedPathChanged(id);
  }

  /**
   * Select path entrance strategy. Either path start (0) or closest segment (1)
   * @param start starting method
   */
  selectStartingSegment(start) {
    console.log(start[0]);
    this.pathParamService.segmentStartChanged(start[0]);

  }

}
