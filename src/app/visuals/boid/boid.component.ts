import { Component, OnInit, Input } from '@angular/core';
import Boid from 'src/app/services/mover/boid/boid-mover';
import { PositionService } from 'src/app/services/position/position.service';
import { LinA } from 'src/app/shared/lin-alg';
import { ParameterControlService } from 'src/app/services/parameter-controls/parameter.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[vdg-boid]',
  templateUrl: './boid.component.html',
  styleUrls: ['./boid.component.sass']
})
/**
 * Visual representative of boid mover
 */
export class BoidComponent {

  constructor(private readonly position: PositionService, private readonly paramService: ParameterControlService) {
    this.subscribe();
  }

  /**
   * Color path normal if boid is too far
   */
  get pathDist() {
    return this.boid.tooFar === true ? 'red' : this.boid.color();
  }

  /**
   * Points towards the x-direction with desired direction
   */
  get visTx() {
    return LinA.tx(this.boid.theta) * this.position.PX(20);
  }

  /**
   * Points towards the y-direction with desired direction
   */
  get visTy() {
    return LinA.ty(-this.boid.theta) * this.position.PX(20);
  }

 /**
  * Points towards the x-direction from the wander cirlcle towards the target
  */
  get visWX() {
    return LinA.tx(this.boid.wanderTheta) * this.position.PX(20 + this.wr);
  }

  /**
   * Points towards the y-direction from the wander cirlcle towards the target
   */
  get visWY() {
    return LinA.ty(-this.boid.wanderTheta) * this.position.PX(20 + this.wr);
  }

  /**
   * Visualize textual information
   */
  get info() {
    return `${this.boid.id}:
    (${Math.round(this.boid.location[0])} |
    ${Math.round(this.boid.location[1])}),
    t: ${Math.round(this.boid.theta)},
    wanderTheta: ${Math.round(this.boid.wanderTheta)}`;
  }
  // tslint:disable-next-line: no-input-rename
  @Input('vdg-boid') boid: Boid;

  debug: boolean;
  debug_wanderRadius: boolean;
  debug_wanderDist: boolean;
  debugPosition: boolean;
  debugPathFollowing: boolean;
  debugAlignmentRadius: boolean;
  debugCohesionRadius: boolean;
  debugNeighboorhoodRadius: boolean;

  // force weighting
  separationForceWeight: number;
  wanderForceWeight: number;
  arriveForceWeight: number;

  alignmentRadius: number;
  cohesionRadius: number;
  wr = 10;
  /**
   * Subscribe to parameter controls
   */
  subscribe() {
    this.paramService.debugSource$.subscribe(d => { this.debug = d; });

    this.paramService.debugNeighboorhoodRadiusSource$.subscribe(d => { this.debugNeighboorhoodRadius = d; });

    this.paramService.debugWanderRadiusSource$.subscribe(d => { this.debug_wanderRadius = d; });
    this.paramService.debugWanderDistSource$.subscribe(d => { this.debug_wanderDist = d; });
    this.paramService.debugPositionSource$.subscribe(d => { this.debugPosition = d; });

    this.paramService.separationForce$.subscribe(d => { this.separationForceWeight = d; });
    this.paramService.wanderForce$.subscribe(d => { this.wanderForceWeight = d; });
    this.paramService.arriveForce$.subscribe(d => { this.arriveForceWeight = d; });
    this.paramService.alignmentRadiusSource$.subscribe(d => { this.alignmentRadius = d; });
    this.paramService.cohesionRadiusSource$.subscribe(d => { this.cohesionRadius = d; });

    this.paramService.debugPathFollowingSource$.subscribe(d => { this.debugPathFollowing = d; });
    this.paramService.debugAlignmentRadiusSource$.subscribe(d => { this.debugAlignmentRadius = d; });
    this.paramService.debugCohesionRadiusSource$.subscribe(d => { this.debugCohesionRadius = d; });
  }

  /**
   * Transforms arena x-coordinate to respective x-coordinate in pixels
   * @param x x-coordinate in arena space
   */
  PX(x: number) {
    // return this.position.PX(this.boid.sx)
    return this.position.PX(x);
  }

  /**
   * Transforms arena y-coordinate to respective y-coordinate in pixels
   * @param y y-coordinate in arena space
   */
  PY(y: number) {
    // return this.position.PY(this.boid.sy)
    return this.position.PY(y);
  }

  /**
   * Points towards the x-direction with desired direction
   * @param theta boid orientation
   * @param d distance
   */
  visX(theta: number, d: number) {
    return LinA.tx(theta) * this.position.PX(d);
  }

  /**
   * Points towards the y-direction with desired direction
   * @param theta boid orientation
   * @param d distance
   */
  visY(theta: number, d: number) {
    return LinA.ty(-theta) * this.position.PX(d);
  }

  /**
   * Determine path target
   */
  pathTarget() {
    if (typeof this.boid.pathTarget === 'undefined') {
      return this.boid.futurePosition;
    } else {
      return this.boid.pathTarget;
    }
  }

}
