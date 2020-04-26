import { Component, OnInit, Output } from '@angular/core';
import { ObstacleService } from '../../services/obstacle/obstacle.service';
import { Obstacle } from '../../interfaces/obstacle';
import { MoverService } from '../../services/mover/mover.service';
import { SimulationService } from '../../services/simulation/simulation.service';
import { Model } from '../../interfaces/model';
import { ModelService } from '../../services/models/model.service';
import { ParameterControlService } from '../../services/parameter-controls/parameter.service';
import { Mover } from '../../interfaces/mover';
import { PathService } from '../../services/path/path.service';
import { Path } from '../../interfaces/path';
import { ParameterControlPathService } from '../../services/parameter-controls/path/path-controls.service';
import { ExportService } from '../../services/export/export.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'vdg-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.sass'],
  providers: [DatePipe]
})
/**
 * Main component of Angular application. Initializes all objects to be transferred to simulation arena.
 */
export class ControllerComponent implements OnInit {

  // predefined obstacles
  @Output() public obstacles: Obstacle[];

  // predefined movement path
  @Output() public paths: Path[];

  // predefined movers
  @Output() public movers: Mover[];

  // selected model
  @Output() public model: Model;

  @Output() toggleRun = false;

  @Output() isRecording = false;


  constructor(private readonly obstacleService: ObstacleService, private readonly moverService: MoverService,
              private readonly simulationService: SimulationService, private readonly modelService: ModelService,
              private readonly paramService: ParameterControlService, private readonly paramPathService: ParameterControlPathService,
              private readonly pathService: PathService, private readonly exportService: ExportService) {

    this.obstacles = this.obstacleService.getObstacles();
    this.paths = this.pathService.getPaths();
    this.model = this.modelService.getSelectedModel();


    this.paramService.arenaSource$.subscribe(d => {
      // console.log("arena size has changed " + d)
      this.updateMovers();
    });

    this.paramService.modelSource$.subscribe(d => {
      // console.log("model has changed " + d)
      this.updateMovers();
    });

    this.paramService.placementSource$.subscribe(d => {
      // console.log("placemenet method has changed " + d)
      this.updateMovers();
    });

    this.paramService.clusterNumberSource$.subscribe(d => {
      // console.log("cluster has changed " + d)
      this.updateMovers();
    });
    this.paramService.moverNumberSource$.subscribe(d => {
      // console.log("cluster has changed " + d)
      this.updateMovers();
    });

    // React to changes in path selection
    this.paramPathService.selectedPathSource$.subscribe(d => {
      // console.log(`path id has changed ${d}`)
      this.getSelectedPath(d);
    });


  }
  /**
   * Initializes component as well as mover placement and first move
   */
  ngOnInit() {
    /** Subscribes to simulation update and triggers arena rendering */
    this.simulationService.simulationMessage.subscribe(frameId => {
      // console.log(`movers move @frame ${frameId}`)
      // this.exportFrameId = frameId;
      this.movers = this.moverService.move();

      if (this.isRecording) {
        this.exportService.exportMoverData(this.movers);
      }

    });
  }
  /**
   * Resets movers and create new ones.
   */
  updateMovers() {
    this.reset();
    this.movers = this.moverService.getMovers();

  }

  /**
   * Select path that user has chosen.
   * @param id path id
   */
  getSelectedPath(id: number) {
    const p = this.pathService.getPath(id);
    this.paths = new Array();
    this.paths.push(p);
  }

  /**
   * Resets mover and obstacles, when arena size has changed --> global model
   */
  public reset(): void {
    this.moverService.resetMovers();
  }

  /**
   * Stepwise simulation
   */
  public stepWiseSimulation(): void {
    this.moverService.move();
    // this.arenaService.repaint(42, this.model.name());
  }

  /**
   * Set simulation and execution speed
   * @param fps frames per second
   */
  public setFPS(fps: number): void {
    this.simulationService.setFPS(fps);
  }


  /**
   * Download recorded data
   */
  public download() {
    this.exportService.createDownload();
  }

  /**
   * Donwload paths
   */
  public downloadPathData() {
    this.exportService.createPathDownload(this.paths);
  }

  /**
   * Download obstacles
   */
  public downloadObstacleData() {
    this.exportService.createObstacleDownload(this.obstacles);
  }

  /**
   * Toggle simulation and movement execution
   */
  public toggleSimulation(): void {
    this.toggleRun = !this.toggleRun;
    // if (this.isRecording) {
    //   this.isRecording = false;
    // }
    // console.log(`Recording: ${this.isRecording}, run: ${this.toggleRun}`)
    this.simulationService.run();
  }

  /**
   * Records data
   */
  public record(): void {
    this.isRecording = !this.isRecording;
    // if (this.toggleRun) {
    //   this.toggleRun = false;
    // }
    // console.log(`Recording: ${this.isRecording}, run: ${this.toggleRun}`)
    this.simulationService.run();
  }

}
