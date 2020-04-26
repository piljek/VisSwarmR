import { Injectable, Output, EventEmitter } from '@angular/core';
import { ArenaService } from '../arena/arena.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Service to execute the movement steps of the models. Handles the simulation and execution speed.
 */
export class SimulationService {

  private FPS = 25;
  private TICKS: number = 1000 / this.FPS;
  private RUN_SIMULATION = false;

  private frameId = 0;


  private messageSource = new BehaviorSubject<number>(this.frameId);
  simulationMessage = this.messageSource.asObservable();

  constructor() {
  }

  /**
   * Run simulation and data generation
   */
  run() {
    this.toggleSimulation();
    this.gameLoop();
  }
  /**
   * Toggles simulation boolean if it's running
   */
  toggleSimulation() {
    this.RUN_SIMULATION = !this.RUN_SIMULATION;
    console.log(`run: ${this.RUN_SIMULATION}`);
  }


  /**
   * Game loop to execute movement steps to fixed frame rate in main thread.
   */
  public async gameLoop() {
    const startTime = Date.now();

    if (!this.RUN_SIMULATION) {
      cancelAnimationFrame(this.frameId);
    } else {
      this.messageSource.next(this.frameId);
      const endTime = Date.now();
      const delta = endTime - startTime;

      if (delta <= this.TICKS) {
        // elapsed
        const elapsed = this.TICKS - delta;
        await this.sleep(elapsed);
      }
      this.frameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  /**
   * Pauses execution steps when execution is faster than it should be
   * @param milliseconds sleeping time
   */
  private sleep(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * Determine how many times per second the movement execution must performed.
   * @param fps frames per second
   */
  public setFPS(fps: number): void {
    this.FPS = fps;
    this.TICKS = 1000 / this.FPS;
  }

}
