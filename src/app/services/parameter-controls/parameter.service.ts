import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MODELS } from '@assets/vdg-models';
import CONFIG from '@assets/vdg-config';
// import { MODEL } from '../models/model';

@Injectable({
  providedIn: 'root'
})
export class ParameterControlService {


/**
 * *****************************************
 * World and general parameters
 * *****************************************
 */

  // Observable source
  private arenaSource = new BehaviorSubject<number[]>([CONFIG.ARENA_WIDTH, CONFIG.ARENA_HEIGHT]);
  private screenSource = new BehaviorSubject<number[]>([CONFIG.ARENA_WIDTH, CONFIG.ARENA_HEIGHT]);

  private placementSource = new BehaviorSubject<string>(CONFIG.PLACEMENT);
  private clusterNumberSource = new BehaviorSubject<number>(CONFIG.CLUSTER);
  private clustOrientVariationSource = new BehaviorSubject<number>(45);
  private moverNumberSource = new BehaviorSubject<number>(CONFIG.N);


  // Observable Streams
  arenaSource$ = this.arenaSource.asObservable();
  screenSource$ = this.screenSource.asObservable();
  placementSource$ = this.placementSource.asObservable();
  clusterNumberSource$ = this.clusterNumberSource.asObservable();
  clustOrientVariationSource$ = this.clustOrientVariationSource.asObservable();
  moverNumberSource$ = this.moverNumberSource.asObservable();

  /**
   * *****************************************
   * Path following parameters
   * *****************************************
   */


  /**
   * *****************************************
   * Model selection
   * *****************************************
   */

  private modelSource = new BehaviorSubject<string>(MODELS.MODEL_REYNOLDS_1999.id);
  modelSource$ = this.modelSource.asObservable();


  /**
   * *****************************************
   * Couzin parameters
   * *****************************************
   */



  // Observable Sources
  private zorSource = new BehaviorSubject<number>(MODELS.MODEL_COUZIN_2002.zor);
  private zooSource = new BehaviorSubject<number>(MODELS.MODEL_COUZIN_2002.zoo);
  private zoaSource = new BehaviorSubject<number>(MODELS.MODEL_COUZIN_2002.zoa);
  private maxTurnSource = new BehaviorSubject<number>(MODELS.MODEL_COUZIN_2002.turning_rate);
  private percFieldSource = new BehaviorSubject<number>(MODELS.MODEL_COUZIN_2002.perception_field);
  private percLengthSource = new BehaviorSubject<number>(MODELS.MODEL_COUZIN_2002.perception_length);
  private turningNoiseSource = new BehaviorSubject<number>(MODELS.MODEL_COUZIN_2002.turning_noise);
  private bodySizeSource = new BehaviorSubject<number>(MODELS.MODEL_COUZIN_2002.body_size);
  private velocitySource = new BehaviorSubject<number>(MODELS.MODEL_COUZIN_2002.velocity);
  private speedSource = new BehaviorSubject<number>(MODELS.MODEL_COUZIN_2002.speed);


  // Observable Streams
  zorSource$ = this.zorSource.asObservable();
  zooSource$ = this.zooSource.asObservable();
  zoaSource$ = this.zoaSource.asObservable();
  maxTurnSource$ = this.maxTurnSource.asObservable();
  percFieldSource$ = this.percFieldSource.asObservable();
  percLengthSource$ = this.percLengthSource.asObservable();
  turningNoiseSource$ = this.turningNoiseSource.asObservable();
  bodySizeSource$ = this.bodySizeSource.asObservable();
  velocitySource$ = this.velocitySource.asObservable();
  speedSource$ = this.speedSource.asObservable();


  /**
   * *****************************************
   * Reynolds parameters
   * *****************************************
   */

  // Observable Sources
  private maxSpeedSource = new BehaviorSubject<number>(MODELS.MODEL_REYNOLDS_1999.max_speed);
  private maxForceSource = new BehaviorSubject<number>(MODELS.MODEL_REYNOLDS_1999.max_force);
  private neighborhoodSource = new BehaviorSubject<number>(MODELS.MODEL_REYNOLDS_1999.neighborhood_radius);

  private alignmentRadiusSource = new BehaviorSubject<number>(MODELS.MODEL_REYNOLDS_1999.alignment_radius);
  private cohesionRadiusSource = new BehaviorSubject<number>(MODELS.MODEL_REYNOLDS_1999.cohesion_radius);


  private wanderRadiusSource = new BehaviorSubject<number>(MODELS.MODEL_REYNOLDS_1999.wanderRadius);
  private wanderDistSource = new BehaviorSubject<number>(MODELS.MODEL_REYNOLDS_1999.wanderDist);
  private wanderChangeSource = new BehaviorSubject<number>(MODELS.MODEL_REYNOLDS_1999.wanderChange);

  private activateObstaclesSource = new BehaviorSubject<boolean>(false);
  private obstacleOffsetSource = new BehaviorSubject<number>(1);
  private borderOffsetSource = new BehaviorSubject<number>(CONFIG.WALL_OFFSET);
  // obstacleOffsetSource: any;
  // borderOffsetSource: any;

  private separationForce = new BehaviorSubject<number>(MODELS.MODEL_REYNOLDS_1999.separationForce);
  private wanderForce = new BehaviorSubject<number>(MODELS.MODEL_REYNOLDS_1999.wanderForce);
  private arriveForce = new BehaviorSubject<number>(MODELS.MODEL_REYNOLDS_1999.arriveForce);
  private borderForce = new BehaviorSubject<number>(MODELS.MODEL_REYNOLDS_1999.borderForce);
  private obstacleForce = new BehaviorSubject<number>(MODELS.MODEL_REYNOLDS_1999.obstacleForce);
  // private pathForce = new BehaviorSubject<number>(1);

  // Observable Streams
  maxSpeedSource$ = this.maxSpeedSource.asObservable();
  maxForceSource$ = this.maxForceSource.asObservable();
  neighborhoodSource$ = this.neighborhoodSource.asObservable();

  alignmentRadiusSource$ = this.alignmentRadiusSource.asObservable();
  cohesionRadiusSource$ = this.cohesionRadiusSource.asObservable();

  wanderRadiusSource$ = this.wanderRadiusSource.asObservable();
  wanderDistSource$ = this.wanderDistSource.asObservable();
  wanderChangeSource$ = this.wanderChangeSource.asObservable();

  activateObstaclesSource$ = this.activateObstaclesSource.asObservable();
  obstacleOffsetSource$ = this.obstacleOffsetSource.asObservable();
  borderOffsetSource$ = this.borderOffsetSource.asObservable();

  separationForce$ = this.separationForce.asObservable();
  wanderForce$ = this.wanderForce.asObservable();
  arriveForce$ = this.arriveForce.asObservable();
  borderForce$ = this.borderForce.asObservable();
  obstacleForce$ = this.obstacleForce.asObservable();
  // pathForce$ = this.pathForce.asObservable();


  /**
   * *****************************************
   * Debug parameters
   * *****************************************
   */

  // Observable source
  private debugSource = new BehaviorSubject<boolean>(true);

  // Wall and Obstacle Sources
  private debugObstacleOffset = new BehaviorSubject<boolean>(false);
  private debugBorderOffset = new BehaviorSubject<boolean>(false);

  // Couzin Sources
  private debugPositionSource = new BehaviorSubject<boolean>(false);
  private debugZorSource = new BehaviorSubject<boolean>(false);
  private debugZooSource = new BehaviorSubject<boolean>(false);
  private debugZoaSource = new BehaviorSubject<boolean>(false);
  private debugMaxTurnSource = new BehaviorSubject<boolean>(false);
  private visionSource = new BehaviorSubject<boolean>(false);


  // Reynolds Sources
  private debugNeighboorhoodRadiusSource = new BehaviorSubject<boolean>(false);
  private debugWanderRadiusSource = new BehaviorSubject<boolean>(false);
  private debugWanderDistSource = new BehaviorSubject<boolean>(false);
  private debugWanderChangeSource = new BehaviorSubject<boolean>(false);
  private debugPathFollowingSource = new BehaviorSubject<boolean>(false);
  private debugAlignmentRadiusSource = new BehaviorSubject<boolean>(true);
  private debugCohesionRadiusSource = new BehaviorSubject<boolean>(true);


  // Path Following Sources
  // private debugPathFollowingVisSource = new BehaviorSubject<boolean>(true);

  // Debug
  debugSource$ = this.debugSource.asObservable();

  // Observable Offset Streams (wall and obstacle)
  debugObstacleOffset$ = this.debugObstacleOffset.asObservable();
  debugBorderOffset$ = this.debugBorderOffset.asObservable();

  // Observable Couzin Streams
  debugPositionSource$ = this.debugPositionSource.asObservable();
  debugZorSource$ = this.debugZorSource.asObservable();
  debugZooSource$ = this.debugZooSource.asObservable();
  debugZoaSource$ = this.debugZoaSource.asObservable();
  debugVisionSource$ = this.visionSource.asObservable();
  debugMaxTurnSource$ = this.debugMaxTurnSource.asObservable();

  // Observable Reynolds Streams
  debugNeighboorhoodRadiusSource$ = this.debugNeighboorhoodRadiusSource.asObservable();
  debugWanderRadiusSource$ = this.debugWanderRadiusSource.asObservable();
  debugWanderDistSource$ = this.debugWanderDistSource.asObservable();
  debugWanderChangeSource$ = this.debugWanderChangeSource.asObservable();
  debugPathFollowingSource$ = this.debugPathFollowingSource.asObservable();
  debugAlignmentRadiusSource$ = this.debugAlignmentRadiusSource.asObservable();
  debugCohesionRadiusSource$ = this.debugCohesionRadiusSource.asObservable();

  // Observable Path Following Streams
  // debugPathFollowingVisSource$ = this.debugPathFollowingVisSource.asObservable();

  /**
   * *****************************************
   * Observable methods
   * *****************************************
   */

  /**
   * Arena parameter have changed
   */
  arenaChanged(w: number, h: number) {
    const arena = [];
    arena.push(w);
    arena.push(h);
    this.arenaSource.next(arena);
  }

  /**
   * Screen size changed
   */
  screenSizeChanged(w: number, h: number) {
    const screen = [];
    screen.push(w);
    screen.push(h);
    this.screenSource.next(screen);
  }

  /**
   * Inital placement of movers: Either 'RANDOM' or 'CLUSTER'
   * @param val CLUSTER or RANDOM
   */
  placementChanged(val: string) {
    this.placementSource.next(val);
  }

  /**
   * Number of cluster has changed
   */
  clusterNumberChanged(val: number) {
    this.clusterNumberSource.next(val);
  }

  /**
   * Cluster deviation parameter has changed
   */
  clustOrientVariationChanged(val: number) {
    this.clustOrientVariationSource.next(val);
  }

  /**
   * Number of movers changed
   */
  moverNumberChanged(val: number) {
    this.moverNumberSource.next(val);
  }

  /**
   * Model was switched
   * @param val model id
   */
  modelChanged(val: string) {
    this.modelSource.next(val);
    // Disable debug view, when model changes
    this.debugSource.next(false);
  }

  /**
   * *****************************************
   * Couzin parameters changed
   * *****************************************
   */

  /**
   * Zone of repulsion changed
   * @param val zor
   */
  zorChanged(val: number) {
    this.zorSource.next(val);
  }
  /**
   * Zone of orientation changed
   * @param val zoo
   */
  zooChanged(val: number) {
    this.zooSource.next(val);
  }
  /**
   * Zone of attraction changed
   * @param val zoa
   */
  zoaChanged(val: number) {
    this.zoaSource.next(val);
  }
  /**
   * Turning rate param changed
   * @param val max turning rate
   */
  maxTurnChanged(val: number) {
    this.maxTurnSource.next(val);
  }
  /**
   * Perception field param changed
   * @param val perception field
   */
  percFieldChanged(val: number) {
    this.percFieldSource.next(val);
  }
  /**
   * Visual perception length param changed
   * @param val perception length
   */
  percLengthChanged(val: number) {
    this.percLengthSource.next(val);
  }
  /**
   * BodySize param changed
   * @param val bodySize
   */
  bodySizeChanged(val: number) {
    this.bodySizeSource.next(val);
  }
  /**
   * Velocity param changed
   * @param val velocity
   */
  velocityChanged(val: number) {
    this.velocitySource.next(val);
  }
  /**
   * Speed param changed
   * @param val speed
   */
  speedChanged(val: number) {
    this.speedSource.next(val);
  }
  /**
   * Turning noise param changed
   * @param val turning noise
   */
  turningNoiseChanged(val: number) {
    this.turningNoiseSource.next(val);
  }

  /**
   * *****************************************
   * Reynolds parameters changed
   * *****************************************
   */


  /**
   * Speed parameter
   * @param val speed
   */
  maxSpeedChanged(val: number) {
    this.maxSpeedSource.next(val);
  }
  /**
   * Max force parameter
   * @param val force
   */
  maxForceChanged(val: number) {
    this.maxForceSource.next(val);
  }

  /**
   * Separation parameter
   * @param val separation
   */
  neighborhoodChanged(val: number) {
    this.neighborhoodSource.next(val);
  }

  /**
   * Flocking pattern. Alignment radius
   * @param val radius size
   */
  alignmentRadiusChanged(val: number) {
    this.alignmentRadiusSource.next(val);
  }
  /**
   * Flocking pattern. Cohesion radius
   * @param val radius size
   */
  cohesionRadiusChanged(val: number) {
    this.cohesionRadiusSource.next(val);
  }

  /**
   * Wander Behavior: wander distance changed
   * @param val distance
   */
  wanderRadiusChanged(val: number) {
    this.wanderRadiusSource.next(val);
  }
  /**
   * Wander Behavior: wander noise changed
   * @param val noise
   */
  wanderDistChanged(val: number) {
    this.wanderDistSource.next(val);
  }
  /**
   * Wander Behavior: wander radius changed
   * @param val wander radius size
   */
  wanderChangeChanged(val: number) {
    this.wanderChangeSource.next(val);
  }

  /**
   * Activate obstacle avoidance
   * @param val boolean
   */
  activateObstacles(val: boolean) {
    this.activateObstaclesSource.next(val);
  }


  /**
   * Obstacle offset value has changed
   * @param val obstacle offset value
   */
  obstacleOffsetChanged(val: number) {
    // console.log(`obstacle force ${val}`);
    this.obstacleOffsetSource.next(val);
  }
  /**
   * Border offset value has changed
   * @param val border offset value
   */
  borderOffsetChanged(val: number) {
    // console.log(`border force ${val}`);
    this.borderOffsetSource.next(val);
  }

  /**
   * Weighting forces: Separation force
   * @param val weight
   */
  separationForceChanged(val: number) {
    // console.log(`separation force ${val}`);
    this.separationForce.next(val);
  }
  /**
   * Weighting forces: Wander force
   * @param val weight
   */
  wanderForceChanged(val: number) {
    // console.log(`wander force ${val}`);
    this.wanderForce.next(val);
  }

  /**
   * Weighting forces: Arrive force
   * @param val weight
   */
  arriveForceChanged(val: number) {
    // console.log(`arrival force ${val}`);
    this.arriveForce.next(val);
  }


  /**
   * Weighting forces: Obstacle force
   * @param val weight
   */
  obstacleForceChanged(val: number) {
    // console.log(`obstacle force ${val}`);
    this.obstacleForce.next(val);
  }


  /**
   * Weighting forces: Border force
   * @param val weight
   */
  borderForceChanged(val: number) {
    // console.log(`border force ${val}`);
    this.borderForce.next(val);
  }


  /**
   * *****************************************
   * Debug parameters changed
   * *****************************************
   */

  /**
   * Debug toggle. Activates debug view
   * @param val boolean
   */
  debugToggle(val: boolean) {
    this.debugSource.next(val);
  }

  /**
   * Visual border offset
   * @param val boolean
   */
  borderOffsetDebugged(val: boolean) {
    this.debugBorderOffset.next(val);
  }

  /**
   * Visual obstacle offset
   * @param val boolean
   */
  obstacleOffsetDebugged(val: boolean) {
    this.debugObstacleOffset.next(val);
  }

  /**
   * *****************************************
   * Debug parameters changed
   * *****************************************
   */

  /**
   * Show position label
   * @param event boolean
   */
  debugPosition(val: boolean) {
    this.debugPositionSource.next(val);
  }

  /**
   * Visual zone of repulsion offset
   * @param val boolean
   */
  zorDebugged(val: boolean) {
    this.debugZorSource.next(val);
  }

  /**
   * Visual zone of orientation offset
   * @param val boolean
   */
  zooDebugged(val: boolean) {
    this.debugZooSource.next(val);
  }

  /**
   * Visual zone of attraction offset
   * @param val boolean
   */
  zoaDebugged(val: boolean) {
    this.debugZoaSource.next(val);
  }

  /**
   * Visual field of perception
   * @param val boolean
   */
  visionDebugged(val: boolean) {
    this.visionSource.next(val);
  }

  /**
   * Visual turning rate
   * @param val boolean
   */
  maxTurnDebugged(val: boolean) {
    this.debugMaxTurnSource.next(val);

  }

  /**
   * *****************************************
   * Reynolds debug parameters changed
   * *****************************************
   */

  /**
   * Debug separation radius
   * @param event boolean
   */
  neighborhoodRadiusDebugged(checked: boolean) {
    this.debugNeighboorhoodRadiusSource.next(checked);
  }

  /**
   * Debug wander radius
   * @param event boolean
   */
  wanderRadiusDebugged(checked: boolean) {
    this.debugWanderRadiusSource.next(checked);
  }

  /**
   * Debug wander distance
   * @param event boolean
   */
  wanderDistDebugged(checked: boolean) {
    this.debugWanderDistSource.next(checked);
  }


  /**
   * Debug wander noise
   * @param event boolean
   */
  wanderChangeDebugged(checked: boolean) {
    this.debugWanderChangeSource.next(checked);
  }

  /**
   * Debug path-following
   * @param event boolean
   */
  pathFollowingDebugged(checked: boolean) {
    this.debugPathFollowingSource.next(checked);
  }

  /**
   * Debug alignment radius
   * @param event boolean
   */
  alignmentRadiusDebugged(checked: boolean) {
    this.debugAlignmentRadiusSource.next(checked);
  }

  /**
   * Debug cohesion radius
   * @param event boolean
   */
  cohesionRadiusDebugged(checked: boolean) {
    this.debugCohesionRadiusSource.next(checked);
  }

}
