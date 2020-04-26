import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ParameterControlService } from '../parameter-controls/parameter.service';


@Injectable({
  providedIn: 'root'
})
/**
 * Service for ArenaComponent. Calculates resizing
 */
export class ArenaService {

  constructor(private readonly paramService: ParameterControlService) {
    this.paramService.arenaSource$.subscribe(d => {
      this.arenaWidth = d[0];
      this.arenaHeight = d[1];
    });
  }

  _repaintSubject: Subject<number> = new Subject();
  screenWidth: number;
  screenHeight: number;

  arenaWidth: number;
  arenaHeight: number;

  /**
   * Set arena size in pixels
   * @param _options screen width and height
   */
  public setArenaSize(_options: { width: any; height: any; }): void {
    // console.log(`Changed screen size in arena service: ${_options.width}, ${_options.height}`)


    if ((_options.width || _options.height) === (undefined || NaN)) {
      this.screenHeight = this.arenaHeight;
      this.screenWidth = this.arenaWidth;
    }
    this.screenWidth = _options.width;
    this.screenHeight = _options.height;

    this.paramService.screenSizeChanged(this.screenWidth, this.screenHeight);

  }

}
