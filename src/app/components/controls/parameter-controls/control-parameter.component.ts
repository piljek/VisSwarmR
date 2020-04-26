import { Component, OnInit, Output } from '@angular/core';
import { ParameterControlService } from '../../../services/parameter-controls/parameter.service';
import { MatSliderChange, MatSlideToggleChange, MatCheckboxChange } from '@angular/material';
import { MODELS } from '@assets/vdg-models';
import { ParameterControlPathService } from '../../../services/parameter-controls/path/path-controls.service';

@Component({
  selector: 'vdg-control',
  templateUrl: './control-parameter.component.html',
  styleUrls: ['./control-parameter.component.sass']
})
/**
 * Service to propagate the changes of the parameter controls panel. General as well as model-specific parameters
 */
export class ParameterControlComponent implements OnInit {

  @Output() modelSelection: string; // = MODELS.MODEL_REYNOLDS_1999.id;// = MODEL.COUZIN_2002;
  @Output() models: string[] = [MODELS.MODEL_COUZIN_2002.id, MODELS.MODEL_REYNOLDS_1999.id];
  @Output() placement: string;
  @Output() nr_clusters: number;
  @Output() clustOrientVar: number;
  @Output() nr_movers: number;

  @Output() obstacleOffset: number;
  @Output() borderOffset: number;

  /**
   *****************************************
   * Couzin parameters
   ******************************************
   */

  // Parameters
  @Output() arenaH: number;
  @Output() arenaW: number;
  @Output() screenW: number;
  @Output() screenH: number;

  @Output() zor: number;
  @Output() zoo: number;
  @Output() zoa: number;
  @Output() perception_field: number;
  @Output() perception_length: number;
  @Output() turning_rate: number;
  @Output() turning_noise: number;
  @Output() velocity: number;
  @Output() speed: number;
  @Output() body_size: number;

  // show debug parameters
  @Output() debug: boolean;
  @Output() debug_position: boolean;
  @Output() debug_zor: boolean; // = true;
  @Output() debug_zoo: boolean; // = true;
  @Output() debug_zoa: boolean; // = true;
  @Output() debug_vision: boolean; // = true;
  @Output() debug_turning_rate: boolean; // = true;


  unit = 'units';
  @Output() activate_pathFollowing: boolean;

  /**
  ******************************************
  * Reynolds parameters
  ******************************************
  */

  @Output() max_speed: number;
  @Output() max_force: number;
  @Output() neighborhood_radius: number;

  @Output() alignmentRadius: number;
  @Output() cohesionRadius: number;
  @Output() wanderRadius: number;
  @Output() wanderDist: number;
  @Output() wanderChange: number;


  // show debug parameters
  @Output() debug_alignmentRadius: boolean;
  @Output() debug_cohesionRadius: boolean;
  @Output() debug_wanderRadius: boolean;
  @Output() debug_wanderDist: boolean;
  @Output() debug_wanderChange: boolean;
  @Output() debug_pathFollowing: boolean;


  // weighted steering forces
  @Output() separationForce: number;
  @Output() wanderForce: number;
  @Output() arriveForce: number;
  @Output() pathForce: number;
  @Output() borderForce: number;
  @Output() obstacleForce: number;


  constructor(private readonly paramService: ParameterControlService, private readonly paramPathService: ParameterControlPathService) {
  }

  ngOnInit() {
    this.arena_subscribe();
    this.paramService.modelSource$.subscribe(d => { this.modelSelection = d; });
    this.mover_subscribe();
    this.couzin2002_subscribe();
    this.reynolds1999_subscribe();
    this.debug_subscribe();
  }

  /**
   * General paramaters: Arena paramaters (width and height)
   */
  arena_subscribe() {
    this.paramService.arenaSource$.subscribe(d => {
      this.arenaW = d[0];
      this.arenaH = d[1];
    });
    this.paramService.screenSource$.subscribe(d => {
      this.screenW = Math.round(d[0]);
      this.screenH = Math.round(d[1]);
    });

    this.paramService.obstacleOffsetSource$.subscribe(d => { this.obstacleOffset = d; });
    this.paramService.borderOffsetSource$.subscribe(d => { this.borderOffset = d; });
  }

  /**
   * General paramaters: Mover parameters (size, cluster, orientation variation)
   */
  mover_subscribe() {
    this.paramService.clusterNumberSource$.subscribe(d => { this.nr_clusters = d; });
    this.paramService.clustOrientVariationSource$.subscribe(d => { this.clustOrientVar = d; });
    this.paramService.moverNumberSource$.subscribe(d => { this.nr_movers = d; });
  }

  /**
   * Couzin model parameters. Zonal and mover properties
   */
  couzin2002_subscribe() {
    this.paramService.zorSource$.subscribe(d => { this.zor = d; });
    this.paramService.zooSource$.subscribe(d => { this.zoo = d; });
    this.paramService.zoaSource$.subscribe(d => { this.zoa = d; });
    this.paramService.maxTurnSource$.subscribe(d => { this.turning_rate = d; });
    this.paramService.percFieldSource$.subscribe(d => { this.perception_field = d; });
    this.paramService.percLengthSource$.subscribe(d => { this.perception_length = d; });

    this.paramService.turningNoiseSource$.subscribe(d => { this.turning_noise = d; });
    this.paramService.bodySizeSource$.subscribe(d => { this.body_size = d; });
    this.paramService.velocitySource$.subscribe(d => { this.velocity = d; });
    this.paramService.speedSource$.subscribe(d => { this.speed = d; });
  }

  /**
   * Reynolds model parameters. General and pattern parameters
   */
  reynolds1999_subscribe() {
    this.paramService.maxSpeedSource$.subscribe(d => { this.max_speed = d; });
    this.paramService.maxForceSource$.subscribe(d => { this.max_force = d; });
    this.paramService.neighborhoodSource$.subscribe(d => { this.neighborhood_radius = d; });

    this.paramService.wanderRadiusSource$.subscribe(d => { this.wanderRadius = d; });
    this.paramService.wanderDistSource$.subscribe(d => { this.wanderDist = d; });
    this.paramService.wanderChangeSource$.subscribe(d => { this.wanderChange = d; });

    this.paramService.alignmentRadiusSource$.subscribe(d => { this.alignmentRadius = d; });
    this.paramService.cohesionRadiusSource$.subscribe(d => { this.cohesionRadius = d; });

    this.paramService.wanderDistSource$.subscribe(d => { this.wanderDist = d; });
    this.paramService.wanderChangeSource$.subscribe(d => { this.wanderChange = d; });

    this.paramService.separationForce$.subscribe(d => { this.separationForce = d; });
    this.paramService.wanderForce$.subscribe(d => { this.wanderForce = d; });
    this.paramService.arriveForce$.subscribe(d => { this.arriveForce = d; });
    this.paramService.borderForce$.subscribe(d => { this.borderForce = d; });
    this.paramService.obstacleForce$.subscribe(d => { this.obstacleForce = d; });
  }

  /**
   * Subscribe to debug parameters
   */
  debug_subscribe() {
    this.paramService.debugSource$.subscribe(d => { this.debug = d; });
    this.paramService.debugPathFollowingSource$.subscribe(d => {
      this.debug_pathFollowing = d;
    });

    this.paramPathService.activateSource$.subscribe(d => { this.activate_pathFollowing = d; });

    this.paramService.debugAlignmentRadiusSource$.subscribe(d => { this.debug_alignmentRadius = d; });
    this.paramService.debugCohesionRadiusSource$.subscribe(d => { this.debug_cohesionRadius = d; });
    // this.navService.placementSource$.subscribe(d => { this.placement = d })

  }

  /**
   * Reset parameters
   */
  reset() {
    // console.log("reset values");
    this.couzin2002_subscribe();
  }

  /**
   * Arena parameter have changed
   */
  arenaChanged() {
    this.paramService.arenaChanged(this.arenaW, this.arenaH);
  }

  /**
   * Different model has been selected
   */
  modelChanged() {
    this.paramService.modelChanged(this.modelSelection);
  }

  /**
   * Inital placement of movers: Either 'RANDOM' or 'CLUSTER'
   * @param val CLUSTER or RANDOM
   */
  changePlacement(val: string) {
    this.placement = val;
    this.paramService.placementChanged(val);
  }

  /**
   * Number of cluster has changed
   */
  clusterNumberChanged() {
    this.paramService.clusterNumberChanged(this.nr_clusters);
  }

  /**
   * Cluster deviation parameter has changed
   */
  clustOrientVariationChanged() {
    this.paramService.clustOrientVariationChanged(this.clustOrientVar);
  }

  /**
   * Number of movers changed
   */
  moverNumberChanged() {
    this.paramService.moverNumberChanged(this.nr_movers);
  }

  /**
   * Obstacle offset value has changed
   * @param $event obstacle offset value
   */
  obstacleOffsetChanged($event: MatSliderChange) {
    this.paramService.obstacleOffsetChanged($event.value);
  }

  /**
   * Border offset value has changed
   * @param $event border offset value
   */
  borderOffsetChanged($event: MatSliderChange) {
    this.paramService.borderOffsetChanged($event.value);
  }

  /**
  ******************************************
  * Couzin parameters changed
  ******************************************
  */

  /**
   * Zone of repulsion changed
   * @param $event zor
   */
  zorChanged($event: MatSliderChange) {
    this.paramService.zorChanged($event.value);
  }

  /**
   * Zone of orientation changed
   * @param $event zoo
   */
  zooChanged($event: MatSliderChange) {
    this.paramService.zooChanged($event.value);
  }

  /**
   * Zone of attraction changed
   * @param $event zoa
   */
  zoaChanged($event: MatSliderChange) {
    this.paramService.zoaChanged($event.value);
  }

  /**
   * Turning rate param changed
   * @param $event max turning rate
   */
  maxTurnChanged($event: MatSliderChange) {
    this.paramService.maxTurnChanged($event.value);
  }

  /**
   * Perception field param changed
   * @param $event perception field
   */
  percFieldChanged($event: MatSliderChange) {
    this.paramService.percFieldChanged($event.value);
  }

  /**
   * Visual perception length param changed
   * @param $event perception length
   */
  percLengthChanged($event: MatSliderChange) {
    this.paramService.percLengthChanged($event.value);
  }

  /**
   * BodySize param changed
   * @param $event bodySize
   */
  bodySizeChanged() {
    this.paramService.bodySizeChanged(this.body_size);
  }

  /**
   * Velocity param changed
   * @param $event velocity
   */
  velocityChanged() {
    this.paramService.velocityChanged(this.velocity);
  }

  /**
   * Speed param changed
   * @param $event speed
   */
  speedChanged($event: MatSliderChange) {
    this.paramService.speedChanged($event.value);
  }

  /**
   * Turning noise param changed
   * @param $event turning noise
   */
  turningNoiseChanged() {
    this.paramService.turningNoiseChanged(this.turning_noise);
  }


  /**
  ******************************************
  * Debug parameters changed
  ******************************************
  */

  /**
   * Debug toggle. Activates debug view
   * @param $event boolean
   */
  debugToggle($event: MatSlideToggleChange) {
    this.paramService.debugToggle($event.checked);
  }

  /**
   * Visual obstacle offset
   * @param $event boolean
   */
  obstacleOffsetDebugged($event: MatSlideToggleChange) {
    this.paramService.obstacleOffsetDebugged($event.checked);
  }


  /**
   * Visual border offset
   * @param $event boolean
   */
  borderOffsetDebugged($event: MatSlideToggleChange) {
    this.paramService.borderOffsetDebugged($event.checked);
  }



  /**
  ******************************************
  * Debug parameters changed
  ******************************************
  */

  /**
   * Show position label
   * @param event boolean
   */
  debugPosition(event: MatCheckboxChange) {
    this.paramService.debugPosition(event.checked);
  }


  /**
   * Visual zone of repulsion offset
   * @param $event boolean
   */
  zorDebugged(event: MatCheckboxChange) {
    this.paramService.zorDebugged(event.checked);
  }

  /**
   * Visual zone of orientation offset
   * @param $event boolean
   */
  zooDebugged(event: MatCheckboxChange) {
    this.paramService.zooDebugged(event.checked);
  }

  /**
   * Visual zone of attraction offset
   * @param $event boolean
   */
  zoaDebugged(event: MatCheckboxChange) {
    this.paramService.zoaDebugged(event.checked);
  }

  /**
   * Visual field of perception
   * @param $event boolean
   */
  visionDebugged(event: MatCheckboxChange) {
    this.paramService.visionDebugged(event.checked);
  }

  /**
   * Visual turning rate
   * @param $event boolean
   */
  maxTurnDebugged(event: MatCheckboxChange) {
    this.paramService.maxTurnDebugged(event.checked);
  }

  /**
  ******************************************
  * Reynolds parameters changed
  ******************************************
  */

  /**
   * Speed parameter
   * @param $event speed
   */
  maxSpeedChanged($event: MatSliderChange) {
    this.paramService.maxSpeedChanged($event.value);
  }

  /**
   * Max force parameter
   * @param $event force
   */
  maxForceChanged($event: MatSliderChange) {
    this.paramService.maxForceChanged($event.value);
  }

  /**
   * Separation parameter
   * @param $event separation
   */
  neighborhoodChanged($event: MatSliderChange) {
    this.paramService.neighborhoodChanged($event.value);
  }

  /**
   * Flocking pattern. Alignment radius
   * @param $event radius size
   */
  alignmentRadiusChanged($event: MatSliderChange) {
    this.paramService.alignmentRadiusChanged($event.value);
  }

  /**
   * Flocking pattern. Cohesion radius
   * @param $event radius size
   */
  cohesionRadiusChanged($event: MatSliderChange) {
    this.paramService.cohesionRadiusChanged($event.value);
  }


  /**
   * Wander Behavior: wander distance changed
   * @param $event distance
   */
  wanderDistChanged($event: MatSliderChange) {
    this.paramService.wanderDistChanged($event.value);
  }

  /**
   * Wander Behavior: wander noise changed
   * @param $event noise
   */
  wanderChangeChanged($event: MatSliderChange) {
    this.paramService.wanderChangeChanged($event.value);
  }

  /**
   * Wander Behavior: wander radius changed
   * @param $event wander radius size
   */
  wanderRadiusChanged($event: MatSliderChange) {
    this.paramService.wanderRadiusChanged($event.value);
  }

  /**
   * Weighting forces: Separation force
   * @param $event weight
   */
  separationForceChanged($event: MatSliderChange) {
    this.paramService.separationForceChanged($event.value);
  }

  /**
   * Weighting forces: Wander force
   * @param $event weight
   */
  wanderForceChanged($event: MatSliderChange) {
    this.paramService.wanderForceChanged($event.value);
  }

  /**
   * Weighting forces: Arrive force
   * @param $event weight
   */
  arriveForceChanged($event: MatSliderChange) {
    this.paramService.arriveForceChanged($event.value);
  }

  /**
   * Weighting forces: Border force
   * @param $event weight
   */
  borderForceChanged($event: MatSliderChange) {
    this.paramService.borderForceChanged($event.value);
  }

  /**
   * Weighting forces: Obstacle force
   * @param $event weight
   */
  obstacleForceChanged($event: MatSliderChange) {
    this.paramService.obstacleForceChanged($event.value);
  }


  /**
  ******************************************
  * Reynolds debug parameters changed
  ******************************************
  */

  /**
   * Debug separation radius
   * @param event boolean
   */
  neighborhoodRadiusDebugged(event: MatCheckboxChange) {
    this.paramService.neighborhoodRadiusDebugged(event.checked);
  }

  /**
   * Debug wander radius
   * @param event boolean
   */
  wanderRadiusDebugged(event: MatCheckboxChange) {
    this.paramService.wanderRadiusDebugged(event.checked);
  }

  /**
   * Debug wander distance
   * @param event boolean
   */
  wanderDistDebugged(event: MatCheckboxChange) {
    this.paramService.wanderDistDebugged(event.checked);
  }

  /**
   * Debug wander noise
   * @param event boolean
   */
  wanderChangeDebugged(event: MatCheckboxChange) {
    this.paramService.wanderChangeDebugged(event.checked);
  }

  /**
   * Debug path-following
   * @param event boolean
   */
  pathFollowingDebugged(event: MatCheckboxChange) {
    // console.log(`path following vis debugged ${event.checked}`)
    this.paramService.pathFollowingDebugged(event.checked);
  }

  /**
   * Debug cohesion radius
   * @param event boolean
   */
  cohesionRadiusDebugged(event: MatCheckboxChange) {
    this.paramService.cohesionRadiusDebugged(event.checked);
  }

  /**
   * Debug alignment radius
   * @param event boolean
   */
  alignmentRadiusDebugged(event: MatCheckboxChange) {
    this.paramService.alignmentRadiusDebugged(event.checked);
  }

}
