import { Injectable } from '@angular/core';
import { Model } from '../../../interfaces/model';
import { PositionService } from '../../position/position.service';
import { MODELS } from '@assets/vdg-models';
import Boid from '../../mover/boid/boid-mover';
import Vector from 'ts-vector';
import { ArenaService } from '../../arena/arena.service';
import { LinA } from '../../../shared/lin-alg';
import { ParameterControlService } from '../../parameter-controls/parameter.service';
import { PathService } from '../../path/path.service';
import { Path } from '../../../interfaces/path';
import { ParameterControlPathService } from '../../parameter-controls/path/path-controls.service';
import { ObstacleService } from '../../obstacle/obstacle.service';
import { Obstacle } from '../../../interfaces/obstacle';


@Injectable({
  providedIn: 'root'
})

/**
 * Calculates next movement positions of boids resulting from the Reynolds model.
 */
export class Reynolds1999Model implements Model {
  public static paramService: ParameterControlService;

  target: Vector;
  neighborhoodRadius: number;

  wanderRadius: number;
  wanderDist: number;
  wanderChange: number;
  pathForceWeight: number;

  path: Path;
  followPath: boolean;
  passingRadius: number;
  segmentStartingStrategy: number;

  // obstacles:
  obstacles: Obstacle[];

  // wall collision: offset
  borderOffset: number;
  obstacleOffset: number;

  // Force weights:
  separationForceWeight: number;
  wanderForceWeight: number;
  arriveForceWeight: number;
  borderForceWeight: number;
  obstacleForceWeight: number;
  alignmentRadius: number;
  cohesionRadius: number;
  activateObstacles: boolean;


  constructor(private readonly position: PositionService, private readonly arenaService: ArenaService,
              private readonly paramControlsService: ParameterControlService, private readonly pathService: PathService,
              private readonly paramControlsPathService: ParameterControlPathService, private readonly obstacleService: ObstacleService) {

    Reynolds1999Model.paramService = paramControlsService;
    this.initParameters();
    this.subscribe();
    this.subscribePathParams();
  }

  /**
   * Init environment such as paths and obstacles
   */
  initParameters(): void {
    this.target = new Vector(300, 75);
    this.path = this.pathService.getPaths()[0];
    this.obstacles = this.obstacleService.getObstacles();
    // this.followPath = true;
  }

  /**
   * Subscribe to parameter controls observables
   */
  subscribe() {
    this.paramControlsService.wanderRadiusSource$.subscribe(d => { this.wanderRadius = d; });
    this.paramControlsService.wanderDistSource$.subscribe(d => { this.wanderDist = d; });
    this.paramControlsService.wanderChangeSource$.subscribe(d => { this.wanderChange = d; });
    // this.navigationService.pathForce$.subscribe(d => { this.pathForceWeight = d; });

    // Collision avoidance offsets
    this.paramControlsService.activateObstaclesSource$.subscribe(d => { this.activateObstacles = d; });
    this.paramControlsService.obstacleOffsetSource$.subscribe(d => { this.obstacleOffset = d; });
    this.paramControlsService.borderOffsetSource$.subscribe(d => { this.borderOffset = d; });


    // Forces
    this.paramControlsService.separationForce$.subscribe(d => { this.separationForceWeight = d; });
    this.paramControlsService.wanderForce$.subscribe(d => { this.wanderForceWeight = d; });
    this.paramControlsService.arriveForce$.subscribe(d => { this.arriveForceWeight = d; });

    this.paramControlsService.borderForce$.subscribe(d => { this.borderForceWeight = d; });
    this.paramControlsService.obstacleForce$.subscribe(d => { this.obstacleForceWeight = d; });

  }
  /**
   * Subscribe to path parameter controls observables
   */
  subscribePathParams() {
    this.paramControlsPathService.activateSource$.subscribe(d => {
      // console.log(`path following activated ${d}`)
      this.followPath = d;

      // set wander and arrive force to 0
      const weight = (d) ? 0 : 1;
      this.paramControlsService.wanderForceChanged(0);
      this.paramControlsService.arriveForceChanged(weight);
    });

    this.paramControlsService.alignmentRadiusSource$.subscribe(d => { this.alignmentRadius = d; });
    this.paramControlsService.cohesionRadiusSource$.subscribe(d => { this.cohesionRadius = d; });


    this.paramControlsPathService.segmentStartSource$.subscribe(d => {
      this.segmentStartingStrategy = d;
    });


    // React to changes in path selection
    this.paramControlsPathService.selectedPathSource$.subscribe(d => {
      this.path = this.pathService.getPath(d);
    });
  }


  /**
   * Turn away from wall within wall offset to turn ealier away and to create smoother turn.
   * Slows down speed when boid approaches the border.
   * @param boid mover
   * @param arenaWidth width of arena
   * @param arenaHeight height of arena
   */
  arriveAtWall(boid: Boid, arenaWidth: number, arenaHeight: number) {

    // current heading direction
    const x = boid.location[0];
    const y = boid.location[1];
    const rand = Math.random() * 10 - 20;
    let dist = Infinity;

    // new attempt
    let target = null;

    // check if boid is left corner (near (0,0))
    if (x < this.borderOffset && y < this.borderOffset) {
      target = new Vector(0, 0);
      dist = Math.min(x, y);
      // console.log(`x,y < d --> ${target}, dist --> ${dist}`);
    } else if (x > (arenaWidth - this.borderOffset) && y > (arenaHeight - this.borderOffset)) {
      target = new Vector(arenaWidth, arenaHeight);
      dist = Math.min((arenaWidth - this.borderOffset), (arenaHeight - this.borderOffset));
      // console.log(`x,y > width or height --> ${target}, dist --> ${dist}`);
    } else

      if (x < this.borderOffset) {
        target = new Vector(0, y + rand);
        dist = x;
        // console.log(`x < d --> ${target}, dist --> ${dist}`);
      } else if (x > (arenaWidth - this.borderOffset)) {
        target = new Vector(arenaWidth, y + rand);
        dist = arenaWidth - x;
        // console.log(`x > width --> ${target}, dist --> ${dist}`);
      }

    if (y < this.borderOffset) {
      target = new Vector(x + rand, 0);
      dist = y;
      // console.log(`y < d --> ${target}, dist --> ${dist}`);
    } else if (y > (arenaHeight - this.borderOffset)) {
      target = new Vector(x + rand, arenaHeight);
      dist = arenaHeight - y;
      // console.log(`y > height --> ${target}, dist --> ${dist}`);
    }

    // console.log(`target --> ${target}, dist --> ${dist}`);

    if (target != null) {
      const desiredMag = (dist / this.borderOffset);

      const fleeForce = boid.flee(target);
      fleeForce.multiplySelf(desiredMag);
      // console.log(`fleeForce ${fleeForce}`)
      return fleeForce;
    }

    return new Vector(0, 0);

  }

  /**
   * Execute movement step. Generates the modeled behavior. Each move results in new spatial coordinates and return updated list of boids.
   * @param boids List of boids with new spatial positions
   */
  move(boids: Boid[]): Boid[] {

    boids.forEach(boid => {

      const futurePosition = this.predictPosition(boid, boid.wanderD).add(boid.location);
      boid.futurePosition = futurePosition;
      const target = futurePosition;
      boid.setBorders(this.arenaService.arenaWidth, this.arenaService.arenaHeight);
      boid.wander(target);

      const borderForce = new Vector(0, 0);
      const obstacleForce = new Vector(0, 0);
      const separationForce = new Vector(0, 0);
      borderForce.addSelf(this.arriveAtWall(boid, this.arenaService.arenaWidth, this.arenaService.arenaHeight));
      obstacleForce.addSelf(this.avoidObstacles(boid, this.obstacles));
      separationForce.addSelf(boid.separate(boids));


      // if path following is active --> user choice
      if (this.followPath) {
        const pathSteer = this.pathFollowing(boid, this.path);
        boid.applyForce(pathSteer);
      } else {
        const flockingForce = this.flocking(boid, boids);
        const wanderForce = boid.seek(boid.futurePosition);
        boid.applyForce(wanderForce.multiply(1));
        boid.applyForce(flockingForce.multiply(1));
      }

      boid.applyForce(separationForce.multiplySelf(this.separationForceWeight));
      boid.applyForce(obstacleForce.multiplySelf(this.obstacleForceWeight));
      boid.applyForce(borderForce.multiplySelf(this.borderForceWeight));


      boid.update();

      boid.border();
      boid.render();

    });
    return boids;
  }


  /*****************************************************************************************
   *
   * FLOCKING PATTERN
   *
   *****************************************************************************************/

  /**
   * Flocking pattern: Move as group. Separate from others when collision occurs, align with interactiing movers and attract towards others
   * @param boid mover
   * @param boids other movers in same cluster
   */
  flocking(boid: Boid, boids: Boid[]) {
    const alignR = this.alignmentRadius;
    const cohesionR = this.cohesionRadius;
    // let separationR = this.neighborhoodRadius;
    let flockingForce = new Vector(0, 0);
    let alignForce = new Vector(0, 0);
    let cohesionForce = new Vector(0, 0);


    // find interacting movers
    const interactors = this.determineInteractingMovers(boid, boids, cohesionR);

    // equalizers = boids within alignment-range ( < alignR)
    const equalizers = interactors.filter(d => {
      const dist = LinA.euclideanDist(boid.sx, d.sx, boid.sy, d.sy);
      return (boid.id !== d.id) && (dist < alignR) && (boid.cid === d.cid);
    });
    // console.log("equalizers")
    // console.log(equalizers)


    // attractors = boids outside alignment-range ( > alignR)
    const attractors = interactors.filter(d => {
      const dist = this.position.euclideanDist(boid.sx, d.sx, boid.sy, d.sy);
      return (boid.id !== d.id) && (dist > alignR) && (boid.cid === d.cid);
    });

    // let separationForce = this.separate(boid, boids);

    if (equalizers.length > 0) {
      alignForce = this.align(boid, equalizers);
    }

    if (attractors.length > 0) {
      cohesionForce = this.cohesion(boid, attractors);
    }

    // this.combineFlockingForces(separationForce, alignForce, cohesionForce);
    flockingForce = new Vector(0, 0);
    if (!isNaN(alignForce[0]) && !isNaN(alignForce[1])) {
      // console.log(`flocking ${flockingForce} add align ${alignForce}`)
      flockingForce.addSelf(alignForce);
    }
    if (!isNaN(cohesionForce[0]) && !isNaN(cohesionForce[1])) {
      // console.log(`flocking ${flockingForce} add align ${cohesionForce}`)
      flockingForce.addSelf(cohesionForce);
    }
    // flockingForce.
    //   addSelf(alignForce.multiply(1)).
    //   addSelf(cohesionForce.multiply(1));
    return flockingForce;

  }

  /**
   * Filter mover that interact with boids within radius r
   * @param boid mover
   * @param boids other movers of same group
   * @param r radius
   */
  determineInteractingMovers(boid: Boid, boids: Boid[], r: number) {
    return boids.filter(d => {
      const dist = this.position.euclideanDist(boid.sx, d.sx, boid.sy, d.sy);
      return (boid.id !== d.id) && (dist < r) && (boid.cid === d.cid);
    });
  }

  /**
   * Steer away from others when collision occurs
   * @param boid mover
   * @param boids other boids of same cluster
   */
  separate(boid: Boid, boids: Boid[]) {
    return boid.separate(boids);
  }

  /**
   * Algin with boids within alignment radius. Calculate average velocity and set magnitude towards max_length
   * @param boid mover
   * @param boids boids within alignment radius
   */
  align(boid: Boid, boids: Boid[]) {
    const v = new Vector(0, 0);
    let steer = new Vector(0, 0);
    boids.forEach(b => {
      v.addSelf(b.velocity);
    });


    if (boids !== undefined && boid !== undefined && boids.length > 0) {
      v.divideSelf(boids.length);

      v.multiplySelf(boid.limit(v, boid.max_speed));

      steer = v.subtract(boid.velocity);
      const steerMag = boid.limit(steer, boid.max_force);
      steer.normalizeVector().multiplySelf(steerMag);
      return steer;
    }
    // console.log(`alignment steer: velocity: ${boid.velocity}, v: ${v} --> steer ${steer}`)
    return new Vector(0, 0);
  }

  /**
   * Tend towards boids within cohesion radius.
   * @param boid mover
   * @param boids  mover outside alignment, but in cohesion radius
   */
  cohesion(boid: Boid, boids: Boid[]) {
    const center = new Vector(0, 0);
    boids.forEach(b => {
      center.addSelf(b.location);
    });
    if (boids.length > 0) {
      // console.log(`center ${center}`)
      return boid.seek(center.divideSelf(boids.length));
    }
    return new Vector(0, 0);
  }

  /*****************************************************************************************
   *
   * PATH-FOLLOWING
   *
   *****************************************************************************************/

  /**
   * Follow path. Boid steers/seeks segment center when normal is too far from center line
   * @param boid mover
   * @param path path to follow
   */
  pathFollowing(boid: Boid, path: Path) {
    const steer = new Vector(0, 0);

    // Check pathId and segmentId when user has switched the path
    if (boid.pathId !== this.path.id) {

      boid.pathId = this.path.id;
      let segmentId = 0;
      if (this.segmentStartingStrategy === 1) {
        segmentId = this.determineClosestSegment(boid.location, this.path);
      }
      // determine segment boid is currently the closest to
      boid.currentSegmentId = segmentId;
      boid.passedStart = false;
    }

    // determine pathFollowing Target
    const target = this.determinePathTarget(boid, this.path);
    const currentSegment = this.path.segments[boid.currentSegmentId];

    // let normalPoint = this.normalPoint(boid.futurePosition, currentSegment.start, currentSegment.end);
    // let pathTarget = normalPoint.add(currentSegment.unitVec.multiply(boid.wanderD));
    boid.normalPoint = this.normalPoint(boid.futurePosition, currentSegment.start, currentSegment.end);
    boid.pathTarget = boid.normalPoint.add(currentSegment.unitVec.multiply(boid.wanderD));

    const distFromPath = LinA.euclideanDist(boid.futurePosition[0], boid.normalPoint[0],
      boid.futurePosition[1], boid.normalPoint[1]);
    // let distFromPath = this.determineSegmentDistance(boid, currentSegment);
    // console.log(`path target ${boid.pathTarget}`)
    if (distFromPath > .5 * this.path.radius) {
      boid.tooFar = true;
      // let steer = boid.seek(boid.pathTarget);
      steer.addSelf(boid.seek(target));
      // boid.applyForce(steer)
    } else {
      boid.tooFar = false;
      steer.addSelf(boid.seek(target));
    }

    const startDist = this.position.euclideanDist(boid.location[0], currentSegment.start[0], boid.location[1], currentSegment.start[1]);
    const endDist = this.position.euclideanDist(boid.location[0], currentSegment.end[0], boid.location[1], currentSegment.end[1]);

    // boid has passed segment start
    if (startDist < this.path.passingRadius) {
      boid.passedStart = true;
    }

    // boid has reached segment end. Proceed to next one or start at 0
    if (endDist < this.path.passingRadius) {
      boid.passedEnd = true;
      boid.currentSegmentId = (boid.currentSegmentId + 1) % this.path.segments.length;
      boid.passedStart = false;
      boid.passedEnd = false;
    } else
      // don't display normal point and pathTarget when path entrance has not been hit
      if (!boid.passedStart) {
        boid.normalPoint = boid.location;
        boid.pathTarget = boid.location;
      }
    return steer;
  }

  /**
   * Determine closest segment based on boids location
   * @param location movers location
   * @param path path to follow
   */
  determineClosestSegment(location: Vector, path: Path) {
    let segmentId = 0;
    let dist = Infinity;
    path.segments.forEach(segment => {
      const sd = this.position.euclideanDist(location[0], segment.start[0], location[1], segment.start[1]);
      if (sd < dist) {
        dist = sd;
        segmentId = segment.id;
      }
    });
    return segmentId;
  }

  /**
   * Based on future position, find target on segment. Either boid has passed the segment start, then it can process to the next
   * otherwise the mover has to pass the starting point of the segment
   * @param boid mover
   * @param path path to follow
   */
  determinePathTarget(boid: Boid, path: Path) {
    const target = boid.futurePosition;

    // path entrance not passed yet
    if (!boid.passedStart) {

      if (boid.currentSegmentId === 0) {
        if (this.segmentStartingStrategy === 1) {
          boid.currentSegmentId = this.determineClosestSegment(target, this.path);
        }
      }
      return path.segments[boid.currentSegmentId].start;
    } else if (boid.passedStart) {

      return path.segments[boid.currentSegmentId].end;
    }
    // console.log(`neither conditions are fulfilled ${target}`)
    return target;
  }


  /**
   * Dot product to get the normal point on the current path segment
   * @param predPos predicted position in future
   * @param start start point of segment
   * @param end end point of segment
   */
  normalPoint(predPos: Vector, start: Vector, end: Vector) {
    // let v be vector from starting point p on path towards the predicted future position v
    const a = predPos.subtract(start);
    const b = end.subtract(start);

    // simplification
    const normal = b.normalizeVector().multiplySelf(a.dot(b));
    const normalPoint = start.add(normal);
    // console.log(`normalization 2: ${normalPoint}`)
    return normalPoint;
  }


  /*****************************************************************************************
   *
   * OBSTACLE AVOIDANCE
   *
   *****************************************************************************************/

  /**
   * Check if boid tend to collide with obstacle and steer away from it
   * @param boid mover
   * @param obstacles List<Obstacle>
   */
  avoidObstacles(boid, obstacles: Obstacle[]) {
    const steer = new Vector(0, 0);
    if (this.activateObstacles) {
      obstacles.forEach(o => {
        const dist = this.position.euclideanDist(boid.futurePosition[0], o.x, boid.futurePosition[1], o.y);
        const offset = o.offset * this.obstacleOffset;
        if (dist < (o.r + offset)) {
          steer.addSelf(boid.flee(new Vector(o.x, o.y)));
        }
      });
    }
    // console.log(`boid flee force ${steer}`)
    return steer; // new Vector(0, 0);
  }

  /**
   * Predicts movement position according to current velocity of boid in future
   * @param boid mover
   * @param m distance in future
   */
  predictPosition(boid: Boid, m: number) {
    const futLoc = boid.velocity.normalizeVector().multiply(m);
    // console.log(futLoc)
    return futLoc;
  }


  name(): string {
    return MODELS.MODEL_REYNOLDS_1999.id;
  }


}
