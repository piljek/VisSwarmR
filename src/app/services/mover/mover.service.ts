import { Injectable } from '@angular/core';
import { MODELS } from '@assets/vdg-models';
import { Model } from '../../interfaces/model';
import { ArenaService } from '../arena/arena.service';
import { ModelService } from '../models/model.service';
import { LinA } from '../../shared/lin-alg';
import { ParameterControlService } from '../parameter-controls/parameter.service';
import { PositionService } from '../position/position.service';
import Boid from './boid/boid-mover';
import { ZonalMover } from './zonal/zonal-mover';
import { Mover } from '../../interfaces/mover';

@Injectable({
  providedIn: 'root'
})
/**
 * Service to generate and place movers
 */
export class MoverService {




  constructor(private readonly modelService: ModelService,
              private readonly paramService: ParameterControlService,
              private readonly position: PositionService) {

    this.parameter_subscription();


    this.ZOR = MODELS.MODEL_COUZIN_2002.zor;

  }
  static count = 0;


  // private movers: Mover[];
  private movers: any[];

  private ZOR: number;
  private arenaWidth: number;
  private arenaHeight: number;
  private modelName: string;
  private model: Model;

  private placement: string;
  private nr_clusters: number;
  private clustOrientVariation: number;
  private nr_movers: number;

  /**
   * Subscribe to parameter controls
   */
  private parameter_subscription(): void {
    this.paramService.arenaSource$.subscribe(d => {
      this.arenaWidth = d[0];
      this.arenaHeight = d[1];
      // console.log(`moverService world changed ${this.arenaWidth}, ${this.arenaHeight}`)
    });

    this.paramService.modelSource$.subscribe(d => {
      this.modelName = d;
      this.model = this.modelService.getSelectedModel(d);
      // console.log(`mover service: ${d} return model: ${this.model.name()}`)
    });

    this.paramService.placementSource$.subscribe(d => {
      this.placement = d;
      // console.log("placememtn " + this.placement)
    });

    this.paramService.clusterNumberSource$.subscribe(d => {
      // console.log("number of clusters has changed: "+ this.nr_clusters )
      this.nr_clusters = d;
    });

    this.paramService.clustOrientVariationSource$.subscribe(d => {
      // console.log("number of clusters has changed: "+ this.nr_clusters )
      this.clustOrientVariation = d;
    });
    this.paramService.moverNumberSource$.subscribe(d => {
      // console.log("number of clusters has changed: "+ this.nr_movers )
      this.nr_movers = d;
    });
  }

  /**
   * Reset movers e.g.  when new placement strategy or new model is chosen
   */
  public resetMovers(): void {
    this.movers = null;
  }


  /**
   * Returns list of movers either cluster- or random based distributed
   */
  public getMovers(): Mover[] {

    if (this.movers == null) {
      // console.log("placement in getMov: " + this.placement)
      if (this.placement === 'CLUSTER') {
        this.movers = this.generateClusterMovers();
      } else {
        this.movers = this.generateRandomMovers();
      }
    }
    return this.movers;
  }

  /**
   * Generate movers when random is chosen as placement strategy
   */
  private generateRandomMovers(): Mover[] {

    // this.movers = this.generateNewRandomMovers();
    // return this.movers;
    // console.log(`mover service: model name: ${this.modelName}`)
    switch (this.modelName) {
      case MODELS.MODEL_COUZIN_2002.id:
        // console.log(`mover service: couzin movers: ${this.modelName}`)
        this.movers = this.generateRandomZonalMovers();
        break;
      case MODELS.MODEL_REYNOLDS_1999.id:
        // console.log(`mover service: reynolds mover: ${this.modelName}`)
        this.movers = this.generateRandomBoids();
        break;
    }
    // console.log(this.movers[0]);

    return this.movers;


  }

  /**
   * Generate movers when cluster is chosen as placement strategy. Cluster centroid and placement deviaton calculated.
   */
  private generateClusterMovers(): Mover[] {

    // this.movers = this.generateNewRandomMovers();
    // return this.movers;
    // N: number, r?: number, cx?: number, cy?: number
    const N = this.nr_movers;
    let r = Math.min(this.arenaWidth, this.arenaHeight);

    const cn = this.nr_clusters; // CONFIG.CLUSTER;
    const centroids = new Array();
    for (let c = 0; c < cn; c++) {
      r = Math.random() * 50 + 15 + (N / (cn * cn));
      const cOrient = Math.random() * 360;
      const cx = Math.random() * (this.arenaWidth - 2 * r) + r;
      const cy = Math.random() * (this.arenaHeight - 2 * r) + r;
      centroids.push([cx, cy, r, cOrient]);
      // centroids.push([Math.random() * (50 - 2 * r) + r, Math.random() * (150 -2* r) +r, r]);

    }
    switch (this.modelName) {
      case MODELS.MODEL_COUZIN_2002.id:

        this.movers = this.generateClusterZonalMovers(N, centroids);
        break;
      case MODELS.MODEL_REYNOLDS_1999.id:

        this.movers = this.generateClusterBoids(N, centroids);
        break;

    }
    console.log(this.movers[0]);

    return this.movers;


  }

  /**
   * Generate cluster mover for the Couzin zonal model
   * @param N number of movers
   * @param centroids cluster centroids
   */
  private generateClusterZonalMovers(N: number, centroids): ZonalMover[] {
    // console.log(" Generate clustered couzin Movers");
    const randomMovers = new Array();


    // let centroids = new Array();
    // for (let c = 0; c < cn; c++) {
    //   centroids.push([Math.random() * this.arenaWidth, Math.random() * this.arenaHeight]);
    // }

    // console.log(centroids);

    for (let i = 0; i < N; i++) {
      // let vals = this.generatePositions(r, cx,cy);
      // let vals = this.generatePositions(r, centroids[(i % cn)][0], centroids[(i % cn)][1]);
      const cid = i % centroids.length;
      const vals = this.generatePositions(centroids[(i % centroids.length)][2],
        centroids[(i % centroids.length)][0], centroids[(i % centroids.length)][1],
        centroids[(i % centroids.length)][3]);

      const m = new ZonalMover(i, vals.sx, vals.sy, cid, vals.theta);

      randomMovers.push(m);
    }

    return randomMovers;
  }

  /**
   * Generates randomly placed movers for the Couzin zonal model
   * @param N Number of movers to be placed
   * @param r radius apart form cluster center
   * @param c cluster center
   */
  private generateRandomZonalMovers(): ZonalMover[] {
    // console.log(" Generate random couzin Movers");
    const randomMovers = new Array();
    const N = this.nr_movers; // CONFIG.N;
    const avoidCollisions = false;

    for (let i = 0; i < N; i++) {
      const sx = Math.random() * this.arenaWidth;
      const sy = Math.random() * this.arenaHeight;
      const theta = Math.random() * 360;
      // theta = -180;

      // if (avoidCollisions) {

      //   let collides = true;
      //   while (collides) {
      //     sx = Math.random() * this.arenaWidth;
      //     sy = Math.random() * this.arenaHeight;
      //     collides = this.placeMovers(sx, sy, randomMovers);
      //   }
      // } else {
      //   this.placeMovers(sx, sy, randomMovers);
      // }

      const m = new ZonalMover(i, sx, sy, -1, theta);

      randomMovers.push(m);
    }

    return randomMovers;
  }


  /**
   * Place movers until no collisions appear
   * @param sx x-Position
   * @param sy y-Position
   * @param randomMovers List of movers
   */
  public placeMovers(sx: number, sy: number, randomMovers: Mover[]): boolean {
    for (const m of randomMovers) {
      const dist = this.position.euclideanDist(m.sx, sx, m.sy, sy);
      if (dist < (this.ZOR + 5 * 2) * 2) { return true; }
    }
    // tslint:disable-next-line: prefer-for-of
    // for (let i = 0; i < randomMovers.length; i++) {
    //   const m: Mover = randomMovers[i];
    //   const dist = this.position.euclideanDist(m.sx, sx, m.sy, sy);
    //   if (dist < (this.ZOR + 5 * 2) * 2) { return true; }
    // }
    return false;

  }

  /**
   * Generate randomly distributed boids for the Reynolds model
   */
  private generateRandomBoids(): Boid[] {
    // console.log(" Generate random boids");
    const randomMovers = new Array();
    const N = this.nr_movers; // CONFIG.N;

    for (let i = 0; i < N; i++) {
      const sx = Math.random() * this.arenaWidth;
      const sy = Math.random() * this.arenaHeight;
      const theta = Math.random() * 360;

      const m = new Boid(i, sx, sy, -1, theta);

      randomMovers.push(m);
    }

    return randomMovers;
  }

  /**
   * Generates boids for cluster-based placement method.
   * @param N number of boids
   * @param centroids cluster centroids
   */
  private generateClusterBoids(N: number, centroids): Boid[] {
    // console.log(" Generate cluster boids");
    MoverService.count = 0;
    const clusterMovers = new Array();
    let index = 0;
    // let centroids = new Array();
    // for (let c = 0; c < cn; c++) {
    //   centroids.push([Math.random() * (this.arenaWidth - r) + .5 * r, Math.random() * (this.arenaHeight - r) + .5 * r]);
    // }

    // console.log(centroids);

    for (let i = 0; i < N; i++) {
      // let vals = this.generatePositions(r, cx,cy);
      const cid = i % centroids.length;
      const vals = this.generatePositions(centroids[(i % centroids.length)][2],
      centroids[(i % centroids.length)][0],
      centroids[(i % centroids.length)][1],
      centroids[(i % centroids.length)][3]);


      const m = new Boid(index++, vals.sx, vals.sy, cid, vals.theta);
      // let m = new Boid(i, sx, sy, theta);

      clusterMovers.push(m);
    }

    return clusterMovers;
  }

  /**
   * Generate collision free cluster based positions around centroid with density radius r.
   * @param r cluster radius --> density
   * @param cx centroid x-Position
   * @param cy centroid y-Position
   * @param cOrient centroid orientation
   */
  generatePositions(r, cx, cy, cOrient) {
    let global = Math.random() * 360;
    let sx = LinA.tx(global) * Math.random() * r + cx;
    let sy = LinA.ty(global) * Math.random() * r + cy;
    const t = Math.random() * 2 * this.clustOrientVariation - this.clustOrientVariation;

    // theta = cOrient;
    const theta = LinA.posDegree(cOrient + t);

    let collides = this.checkBorderCollision(sx, sy);
    while (collides) {
      MoverService.count++;
      // global = Math.random() * 360;
      global = Math.random() * 2 * this.clustOrientVariation - this.clustOrientVariation;
      sx = LinA.tx(global) * Math.random() * r * .5 + cx;
      sy = LinA.ty(global) * Math.random() * r * .5 + cy;
      collides = this.checkBorderCollision(sx, sy);
    }
    // console.log(`mover collides: ${MoverService.count}`)
    return { sx, sy, theta };

  }

  /**
   * Checks if ath position occurs collision when mover is placed
   * @param sx x-Position
   * @param sy y-Position
   */
  private checkBorderCollision(sx: number, sy: number): boolean {
    if ((sx || sy) < 0) {
      return true;
    }
    if (sx > this.arenaWidth) {
      return true;
    }
    if (sy > this.arenaHeight) {
      return true;
    }
    return false;
  }


  /**
   * Generate movement. Execute model to move and to return spatial positions of movers.
   */
  public move(): any {
    this.model.move(this.movers);
    return this.movers;
  }

}
