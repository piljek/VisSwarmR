import { Injectable } from '@angular/core';
import { Obstacle } from 'src/app/interfaces/obstacle';
import obstacleAssets from '@assets/obstacles.json';

@Injectable({
  providedIn: 'root'
})
/**
 * Service to load obstacles
 */
export class ObstacleService {

  private obstacles: Obstacle[] = null;

  constructor() {
    this.obstacles = obstacleAssets;

  }
  /**
   * Gets list of defined obstacles.
   */
  public getObstacles(): Obstacle[] {
    return this.obstacles;
  }
}
