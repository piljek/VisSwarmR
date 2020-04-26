import { Injectable } from '@angular/core';
import { Model } from '../../../interfaces/model';
import { LinA } from '../../../shared/lin-alg';
import { MODELS } from '@assets/vdg-models';

import * as d3 from 'd3';
import { ArenaService } from '../../arena/arena.service';
import { ParameterControlService } from '../../parameter-controls/parameter.service';
import Couzin2002Parameters from './couzin2002.parameters';
import { PositionService } from '../../position/position.service';
import { ZonalMover } from '../../mover/zonal/zonal-mover';

@Injectable({
  providedIn: 'root'
})
/**
 * Calculates next movement positions of zonal movers resulting from the Couzin model.
 */
export class Couzin2002Model implements Model {



  constructor(
    private readonly arenaService: ArenaService,
    private readonly parameterControlService: ParameterControlService,
    private readonly position: PositionService) {

    Couzin2002Model.paramService = parameterControlService;
    this.params = new Couzin2002Parameters(parameterControlService);
    this.subscribe();
  }

  public static paramService: ParameterControlService;

  static i = 0;
  zor: number;
  zoo: number;
  zoa: number;
  turningRate: number;
  velocity: number;
  speed: number;
  perception_field: number;
  perception_length: number;
  body_size: number;
  noise: number;

  params: Couzin2002Parameters;
  epsilon = .2;
  borderOffset: number;
  /**
   * Gets model name
   */
  name() {
    return MODELS.MODEL_COUZIN_2002.id;
  }


  /**
   * Subscribe to parameter control service
   */
  private subscribe(): void {

    this.parameterControlService.zorSource$.subscribe(d => { this.zor = d; });
    this.parameterControlService.zooSource$.subscribe(d => { this.zoo = d; });
    this.parameterControlService.zoaSource$.subscribe(d => { this.zoa = d; });
    this.parameterControlService.maxTurnSource$.subscribe(d => { this.turningRate = d; });
    this.parameterControlService.percFieldSource$.subscribe(d => { this.perception_field = d; });
    this.parameterControlService.percLengthSource$.subscribe(d => { this.perception_length = d; });
    this.parameterControlService.turningNoiseSource$.subscribe(d => { this.noise = d; });
    this.parameterControlService.bodySizeSource$.subscribe(d => { this.body_size = d; });
    this.parameterControlService.velocitySource$.subscribe(d => { this.velocity = d; });
    this.parameterControlService.speedSource$.subscribe(d => { this.speed = d; });

    this.parameterControlService.borderOffsetSource$.subscribe(d => { this.borderOffset = d; });
  }

  /**
   * Execute movement step. Generates the modeled behavior.
   * Each move results in new spatial coordinates and return updated list of zonal movers.
   * @param movers: ZonalMovers
   */
  move(movers: ZonalMover[]): ZonalMover[] {
    // determine collision and desired directions
    movers.forEach(m => {

      const colliders = this.detectColliders(m, movers);
      if (colliders.length > 0) {
        // console.log(`mover ${m.id} has ${colliders.length} colliders in iteration ${Couzin2002Model.i}`)
        // move in opposite direction of collider
        m.collides = true;

        const centerX = d3.mean(colliders, d => d.sx);
        const centerY = d3.mean(colliders, d => d.sy);
        // console.log(`old position of mover ${m.id}: ${m.sx},${m.sy}, mean: ${x_center},${y_center}`)
        const desiredX = m.sx - centerX;
        const desiredY = m.sy - centerY;

        const theta = LinA.posDegree(this.changeDirection(m.theta, desiredX, desiredY));


        // store direction change in mover object
        m.thetaChange = theta;

      } else {
        m.collides = false;

        // determine interacting movers outside blind spot
        const interactors = this.determineInteractingMovers(m, movers);

        m.interacting = interactors.length > 0 ? true : false;

        // split interacting movers in two set: orientation and attraction
        // check for movers in zone of orientation
        const orientors = interactors.filter(d => {
          const dist = this.position.euclideanDist(m.sx, d.sx, m.sy, d.sy);
          return (dist <= this.zoo) && (m.id !== d.id);
        });


        // check for movers in zone of attraction
        const attractors = interactors.filter(d => {
          const dist = this.position.euclideanDist(m.sx, d.sx, m.sy, d.sy);
          return (dist > this.zoo) && (m.id !== d.id);
        });

        const orientationResult = this.orient(m, orientors);
        const attractionResult = this.attract(m, attractors);

        // if either movers align or attract each other, targeted position is averaged
        // if no orientation, but attraction  --> desired target results from attraction
        // if no attraction, but orientation  --> desired target results from orientation
        let vx = 0;
        let vy = 0;
        let i = 0;
        if (orientationResult.performed) {
          vx += LinA.tx(orientationResult.theta);
          vy += LinA.ty(orientationResult.theta);
          i++;
        }

        if (attractionResult.performed) {
          vx += LinA.tx(attractionResult.theta);
          vy += LinA.ty(attractionResult.theta);
          i++;
        }

        const tx = (i > 0) ? vx / i : LinA.tx(m.theta);
        const ty = (i > 0) ? vy / i : LinA.ty(m.theta);

        // thetaChange:
        const targetX = LinA.tx(m.theta) + this.epsilon * tx;
        const targetY = LinA.ty(m.theta) + this.epsilon * ty;
        m.thetaChange = this.changeDirection(m.theta, targetX, targetY);
      }

    });
    this.updatePositions(movers);
    Couzin2002Model.i++;
    return movers;
  }


  orient(m: ZonalMover, movers: ZonalMover[]) {
    let theta = m.theta;
    if (movers.length > 0) {
      const centerX = d3.mean(movers, d => LinA.tx(d.theta));
      const centerY = d3.mean(movers, d => LinA.ty(d.theta));
      theta = LinA.posDegree(LinA.rad2deg(LinA.targetDirection(centerX, centerY)));
    }


    return { mover: m, theta, performed: movers.length > 0 ? true : false };

  }
  attract(m: ZonalMover, movers: ZonalMover[]) {
    let theta = m.theta;
    if (movers.length > 0) {
      const centerX = d3.mean(movers, d => d.sx);
      const centerY = d3.mean(movers, d => d.sy);

      const vx = centerX - m.sx;
      const vy = centerY - m.sy;
      // theta = this.changeDirection(m.theta, vx, vy);
      theta = LinA.posDegree(LinA.rad2deg(LinA.targetDirection(vx, vy)));
    }

    return { mover: m, theta, performed: movers.length > 0 ? true : false };

  }

  /**
   * Calculates the angular orientation between two zonal movers. Return an angle in degrees, ranging from 0-360°
   * @param m zonal mover
   * @param d targeted mover
   */
  interangular(m: ZonalMover, d: ZonalMover): number {
    const theta = LinA.deg2rad(m.theta);

    // vector mover m into its forwarding direction
    const ux = Math.cos(theta);
    const uy = Math.sin(theta);
    const uabs = Math.sqrt(ux * ux + uy * uy);

    // vector of mover d towards mover m
    const vx = d.sx - m.sx;
    const vy = d.sy - m.sy;
    const vabs = Math.sqrt(vx * vx + vy * vy);

    const angle = (ux * vx + uy * vy) / (uabs * vabs);
    const finalAngle = LinA.rad2deg(Math.acos(angle));
    return finalAngle;

  }

  /**
   * Determine interacting movers that are movers field of vision and close enough (within zone of attraction)
   * @param m current mover
   * @param movers other movers of same group
   */
  determineInteractingMovers(m: ZonalMover, movers: ZonalMover[]) {
    const alpha = m.perception_field;

    return movers.filter(d => {
      const dist = this.position.euclideanDist(m.sx, d.sx, m.sy, d.sy);
      const angle = this.interangular(m, d);
      return (m.id !== d.id) && (angle < alpha * .5 && dist < this.zoa) && (m.cid === d.cid);

    });
  }

  /**
   * Update positions of all movers, add noise to movement
   * and calculate new orientations. Also changes velocity direction when border collision occurs
   * @param movers List of zonal movers
   */
  updatePositions(movers: ZonalMover[]) {
    // update positions
    movers.forEach(m => {
      const noise = (Math.random() - 0.5) * this.noise;
      let theta = m.thetaChange;

      // let eps = Math.random() * this.noise * 2 - this.noise;

      let dx = LinA.tx(theta) * this.velocity * this.speed;
      let dy = LinA.ty(theta) * this.velocity * this.speed;
      const targetX = (dx + m.sx);
      const targetY = (dy + m.sy);

      // change direction when object touches arena boundaries
      if (targetX < 0 || targetX > this.arenaService.arenaWidth) {
        dx *= -1;
      }
      if (targetY < 0 || targetY > this.arenaService.arenaHeight) {
        dy *= -1;
      }
      const newX = (m.sx + dx);
      const newY = (m.sy + dy);
      theta = this.changeDirection(LinA.posDegree(theta), dx, dy) + noise;

      m.thetaChange = theta;
      this.updatePosition(m, LinA.posDegree(theta), newX, newY);
    });
  }

  /**
   * Change direction when movers collide. Desired direction is changed based
   * on target directions in x- and y-direction with respect to the turning angle which is set by the user.
   * @param _theta Current direction that needs to be changed
   * @param x new target direction on x-axis
   * @param y new target direction on y-axis
   */
  changeDirection(_theta: number, x: number, y: number): number {
    // console.log(`debug x:  ${x}, ${y}: target direction: ${Position.targetDirection(x, y)}`)
    const desTheta = LinA.posDegree(LinA.rad2deg(LinA.targetDirection(x, y)));
    const currTheta = LinA.posDegree(_theta);

    const desThetaRad = LinA.deg2rad(desTheta);
    const currThetaRad = LinA.deg2rad(currTheta);

    // check if direction change is within possible turning rate
    const cosRad = Math.cos(desThetaRad) * Math.cos(currThetaRad) + Math.sin(desThetaRad) * Math.sin(currThetaRad);
    const relativeAngle = LinA.rad2deg(Math.acos(cosRad));
    let theta = desTheta;

    // adapt direction angle--> override desired theta
    if (relativeAngle > this.turningRate) {

      // c current direction, d desired direction
      // 330 current direction, 180 desired direction

      // case 1: 330-180 = 150
      const cd = LinA.posDegree(currTheta - desTheta);

      // case 2: 360-330 + 180
      const dc = LinA.posDegree(360 - currTheta + desTheta);

      // angle from current to desired theta smaller, than the other way round
      if (cd <= dc) {
        // ORIGINAL
        // theta = currTheta - this.turningRate;
        theta = currTheta - this.turningRate;
      } else {
        theta = currTheta + this.turningRate;
      }

    }
    return LinA.posDegree(theta);
  }

  /**
   * Sets updated positions. Performs movement-step
   * @param m Mover m
   * @param theta global mover orientation in degrees
   * @param xPos x-Position
   * @param yPos y-Position
   */
  updatePosition(m: ZonalMover, theta: number, xPos: number, yPos: number): ZonalMover {
    m.sx = xPos;
    m.sy = yPos;
    const posTheta = LinA.posDegree(theta);
    m.theta = posTheta;
    return m;
  }

  /**
   * Determine movers within zone of repulsion that collide with mover m
   * @param m current mover
   * @param movers other movers
   */
  private detectColliders(m: ZonalMover, movers: ZonalMover[]) {

    return movers.filter(d => {
      const dist = this.position.euclideanDist(m.sx, d.sx, m.sy, d.sy);
      return (dist < (this.zor)) && (m.id !== d.id);
    });
  }

}
