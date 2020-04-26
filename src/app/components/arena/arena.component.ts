import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Obstacle } from '../../interfaces/obstacle';
import * as d3 from 'd3';
import { MoverService } from '../../services/mover/mover.service';
import { ArenaService } from '../../services/arena/arena.service';
import { ResizedEvent } from '../../shared/resized-event';
import { ParameterControlService } from '../../services/parameter-controls/parameter.service';
import { MODELS } from '@assets/vdg-models';
import { ZonalMover } from '../../services/mover/zonal/zonal-mover';
import { Mover } from '../../interfaces/mover';
import { Path } from '../../interfaces/path';
import { ParameterControlPathService } from '../../services/parameter-controls/path/path-controls.service';


@Component({
  selector: 'vdg-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.sass']
})
/**
 * Simulation Arena to display the model generated mover, as well as obstacles and paths
 */
export class ArenaComponent implements OnInit, AfterViewInit {


  @Input() obstacles: Obstacle[];
  @Input() movers: Mover[];
  @Input() paths: Path[];

  @ViewChild('svgArena', { static: true }) svgRef: ElementRef<SVGElement>;

  private svg: SVGElement;
  private svgSelection: d3.Selection<SVGElement, null, undefined, null>;


  private _options: { width, height } = { width: window.innerWidth - 330, height: window.innerWidth - 200 };


  // private modelName: string;


  /** Simulation parameters */

  private DEBUG = true;
  couzinModel: boolean; // = true;// = false;
  reynoldsModel: boolean; // = true;// = true;

  // private _repaint;

  /** Path following paramters */
  pathFollowingActivated: boolean;

  /**
   * Arena and screen parameters
   */
  private arenaWidth: number;
  private arenaHeight: number;

  private screenWidth: number;
  private screenHeight: number;

  svgMoversGroup: d3.Selection<SVGGElement, null, undefined, null>;

  svgMovers: d3.Selection<SVGCircleElement, ZonalMover, SVGGElement, null>;


  constructor(private readonly arenaService: ArenaService, private readonly paramControlService: ParameterControlService,
              private readonly paramPathService: ParameterControlPathService) {

    // control mover type according to selected model
    this.paramControlService.modelSource$.subscribe(d => {
      this.couzinModel = (d === MODELS.MODEL_COUZIN_2002.id) ? true : false;
      this.reynoldsModel = !this.couzinModel;
    });

    // path following activated
    this.paramPathService.activateSource$.subscribe(d => { this.pathFollowingActivated = d; });
  }


  ngOnInit() {
    this.svg = this.svgRef.nativeElement;
    this.svgSelection = d3.select(this.svg);
    this.init();
    this.aspect_ratio();
  }

  ngAfterViewInit(): void {
    this.render();
  }
  /**
   * Initialize arena parameters as width and height.
   */
  private init(): void {

    this.paramControlService.arenaSource$.subscribe(x => {
      const w = x[0];
      const h = x[1];

      this.arenaWidth = w;
      this.arenaHeight = h;
      this.aspect_ratio();
    });

    this.paramControlService.debugSource$.subscribe(d => { this.DEBUG = d; });



  }

  /**
   * Calculates aspect ratio to display arena coordinates in pixels.
   */
  private aspect_ratio() {
    // (adj_width / adj_height) = (orig_width / orig_height)
    const ar = this.arenaWidth / this.arenaHeight;

    if (this.arenaWidth > this.arenaHeight) {
      this._options.width = this.screenWidth;
      this._options.height = this.screenWidth / ar;
    } else {
      this._options.height = this.screenHeight;
      this._options.width = ar * this.screenHeight;
    }

    // check boundaries
    if (this._options.width > this.screenWidth) {
      const delta = this._options.width - this.screenWidth;
      this._options.width -= delta;
      this._options.height -= delta;
    }

    if (this._options.height > this.screenHeight) {
      const delta = this._options.height - this.screenHeight;
      this._options.width -= delta;
      this._options.height -= delta;
    }
    this.arenaService.setArenaSize(this._options);

    this.render();
  }

  /**
   * Renders arena and resizes arena svg..
   */
  private render(): void {
    if (!this._options || !this._options.width || !this._options.height) {
      return;
    }
    // update svg width / height
    this.arenaService.setArenaSize(this._options);

    this.svgSelection
      .attr('width', this._options.width)
      .attr('height', this._options.height);
  }

  /**
   * Triggers arena resizing when display size has changed
   * @param evt ResizeEvent
   */
  onResized(evt: ResizedEvent) {
    this.screenWidth = evt.newWidth - 5;
    this.screenHeight = evt.newHeight - 5;
    this.aspect_ratio();
  }

}
