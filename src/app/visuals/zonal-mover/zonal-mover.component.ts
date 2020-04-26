import { Component, Input } from '@angular/core';
import { ZonalMover } from '../../services/mover/zonal/zonal-mover';
import { LinA } from 'src/app/shared/lin-alg';
import * as d3 from 'd3';
import { PositionService } from 'src/app/services/position/position.service';
import { ParameterControlService } from 'src/app/services/parameter-controls/parameter.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[zonalMovers]',
  templateUrl: './zonal-mover.component.html',
  styleUrls: ['./zonal-mover.component.sass']
})
/**
 * Visual component for visual zones
 */
export class CouzinZonesComponent {


  // tslint:disable-next-line: no-input-rename
  @Input('zonalMovers') zMover: ZonalMover;
  debug: boolean;
  debugPosition: boolean;
  debugZor: boolean;
  debugZoo: boolean;
  debugZoa: boolean;
  debugVision: boolean;
  debugMaxTurn: boolean;


  constructor(private readonly position: PositionService, private readonly paramService: ParameterControlService) {
    this.subscribe();
  }

  /**
   * Subscribe to parameter controls
   */
  subscribe() {
    this.paramService.debugSource$.subscribe(d => { this.debug = d; });
    this.paramService.debugPositionSource$.subscribe(d => { this.debugPosition = d; });
    this.paramService.debugZorSource$.subscribe(d => { this.debugZor = d; });
    this.paramService.debugZooSource$.subscribe(d => { this.debugZoo = d; });
    this.paramService.debugZoaSource$.subscribe(d => { this.debugZoa = d; });
    this.paramService.debugVisionSource$.subscribe(d => { this.debugVision = d; });
    this.paramService.debugMaxTurnSource$.subscribe(d => { this.debugMaxTurn = d; });

  }

  /**
   * Points towards the x-direction with desired direction
   */
  get visTx() {
    return LinA.tx(this.zMover.theta) * this.position.PX(this.zMover._perception_length);
  }

  /**
   * Points towards the y-direction with desired direction
   */
  get visTy() {
    return LinA.ty(-this.zMover.theta) * this.position.PX(this.zMover._perception_length);
  }

  /**
   * Visualize textual information
   */
  get info() {
    return `${this.zMover.id}:(${Math.round(this.zMover.sx)} | ${Math.round(this.zMover.sy)}), t: ${Math.round(this.zMover.theta)}`;
  }

  /**
   * Zone of repulsion
   */
  zor() {
    return this.position.PX(this.zMover.zor);
  }

  /**
   * Zone of orientation
   */
  zoo() {
    return this.position.PX(this.zMover.zoo);
  }

  /**
   * Zone of attraction
   */
  zoa() {
    return this.position.PX(this.zMover.zoa);
  }

  /**
   * Visualize field of perception
   */
  get visionPath() {
    const theta = this.zMover.theta;
    const alpha = this.zMover.perception_field;

    const startAngle = LinA.deg2rad(360 - theta - 0.5 * alpha + 90);
    const endAngle = LinA.deg2rad(360 - theta + 0.5 * alpha + 90);

    const arcGenerator = d3.arc();
    const pathData = arcGenerator({
      startAngle,
      endAngle,
      innerRadius: 0,
      outerRadius: this.position.PX(this.zMover._perception_length)
    });

    return pathData;
  }

  /**
   * Visualize turning rate
   */
  get turningPath() {
    const theta = this.zMover.theta;
    const alpha = this.zMover._turning_rate;

    const startAngle = LinA.deg2rad(360 - theta - 0.5 * alpha + 90);
    const endAngle = LinA.deg2rad(360 - theta + 0.5 * alpha + 90);

    const arcGenerator = d3.arc();
    const pathData = arcGenerator({
      startAngle,
      endAngle,
      innerRadius: 0,
      outerRadius: this.position.PX(this.zMover._perception_length)
    });

    return pathData;
  }

  /**
   * Color field of perception when mover is interacting with others
   */
  get interacting() {
    let color = 'black';

    if (this.zMover.interacting) {
      color = this.zMover.cid < 0 ? d3.schemeCategory10[0] : this.zMover.color();
    }
    return color;
  }

  /**
   * Transforms arena x-coordinate to respective coordinate in pixels
   * @param x x-coordinate in arena space
   */
  get PX() {
    return this.position.PX(this.zMover.sx);
  }

  /**
   * Transforms arena y-coordinate to respective coordinate in pixels
   * @param y y-coordinate in arena space
   */
  get PY() {
    return this.position.PY(this.zMover.sy);
  }

}
