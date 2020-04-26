import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import CONFIG from '@assets/vdg-config';
import { ParameterControlService } from '../parameter-controls/parameter.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Service class for position calculations as translating arena coordinates to pixels
 */
export class PositionService {



  constructor(private readonly paramService: ParameterControlService) {
    this.arenaW = CONFIG.ARENA_WIDTH;
    this.arenaH = CONFIG.ARENA_HEIGHT;

    this.screenW = CONFIG.ARENA_WIDTH;
    this.screenH = CONFIG.ARENA_HEIGHT;
    this.subscribe();
    this.updateRanges();

  }


  /**
   * Arena and screen parameters
   */
  arenaW: number = CONFIG.ARENA_WIDTH;
  arenaH: number = CONFIG.ARENA_HEIGHT;

  screenW: number = CONFIG.ARENA_WIDTH;
  screenH: number = CONFIG.ARENA_HEIGHT;

  // position scales
  public X: any = d3.scaleLinear().domain([0, this.arenaW]).range([0, this.screenW]);
  public Y: any = d3.scaleLinear().domain([0, this.arenaH]).range([this.screenH, 0]);

  /**
   * Subscribe to parameter controls
   */
  subscribe(): void {
    this.paramService.arenaSource$.subscribe(d => {
      this.arenaW = d[0];
      this.arenaH = d[1];
      this.updateRanges();
    });


    this.paramService.screenSource$.subscribe(d => {
      this.screenW = d[0];
      this.screenH = d[1];
      this.updateRanges();
    });
  }

  /**
   * Updates scaling functions due to resizing or new settings
   */
  updateRanges() {
    this.X = d3.scaleLinear().domain([0, this.arenaW]).range([0, this.screenW]);
    this.Y = d3.scaleLinear().domain([0, this.arenaH]).range([this.screenH, 0]);
  }

  /**
   * Transforms arena x-coordinate to respective x-coordinate in pixels
   * @param x x-coordinate in arena space
   */
  PX(x: number) {
    return Number.isNaN(this.X(x)) ? 0 : this.X(x);
  }

  /**
   * Translates arena y-coordinate towards display coordinate on screen
   * @param y y arena coordinate
   */
  PY(y: number) {
    return Number.isNaN(this.Y(y)) ? 0 : this.Y(y);
  }

  /**
   * Calculates the euclidean distance between two points. Put first x-coordinates, then y-coordinates into method call.
   * @param x1 x-coordinate first point
   * @param x2 x-coordinate second point
   * @param y1 y-coordinate first point
   * @param y2 y-coordinate second point
   */
  public euclideanDist(x1: number, x2: number, y1: number, y2: number) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  }
}


