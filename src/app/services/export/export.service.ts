import { Injectable } from '@angular/core';
import { Mover } from '../../interfaces/mover';
import ExportData from '../../interfaces/export/export';
import { ExportToCsv } from 'export-to-csv';
import { DatePipe } from '@angular/common';
import { Path } from '../../interfaces/path';
import ExportPathData from 'src/app/interfaces/export/export-path';
import { Obstacle } from 'src/app/interfaces/obstacle';
import { LinA } from 'src/app/shared/lin-alg';

@Injectable({
  providedIn: 'root'
})
/**
 * Service to export generated data
 */
export class ExportService {

  _exportMoverData: Array<ExportData>;
  _exportPathData: Array<ExportPathData>;
  exportFrameId = 0;

  exportOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: false,
    filename: 'vdg-export-default',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  };


  constructor(private datepipe: DatePipe) {
    this._exportMoverData = new Array();
    this._exportPathData = new Array();
  }

  /**
   * Exports generated movement data
   * @param movers List<mover>
   */
  exportMoverData(movers: Mover[]) {
    movers.forEach(m => {
      const data: ExportData = {
        frame: this.exportFrameId,
        id: m.id,
        x: m.sx,
        y: m.sy,
        cid: m.cid,
        theta: LinA.posDegree(m.theta)
      };
      this._exportMoverData.push(data);
    });
    this.exportFrameId++;
  }

  /**
   * Exports paths
   * @param paths List<Path>
   */
  exportPathData(paths: Path[]) {
    const exportPathData = new Array<ExportPathData>();
    paths.forEach(path => {
      path.segments.forEach(segment => {
        const data: ExportPathData = {
          path_id: path.id,
          segment_id: segment.id,
          sx: segment.start[0],
          sy: segment.start[1],
          tx: segment.end[0],
          ty: segment.end[1],
          vec_x: segment.unitVec[0],
          vec_y: segment.unitVec[1]
        };
        exportPathData.push(data);
        // console.log(data)
      });
    });
    this.pathDownload(exportPathData);
  }

  /**
   * Prepare data export. Reset list of movers.
   */
  createDownload() {
    if (this._exportMoverData.length > 0) {
      // console.log(this._exportMoverData);
      this.download();

      this._exportMoverData = new Array();
      this.exportFrameId = 0;
    }
  }

  /**
   * Prepare path exports
   * @param paths List<Path>
   */
  createPathDownload(paths: Path[]) {
    if (paths.length > 0) {
      this.exportPathData(paths);
    }
  }

  /**
   * Prepare obstacle exports
   * @param paths List<Obstacle>
   */
  createObstacleDownload(obstacles: Obstacle[]) {
    if (obstacles.length > 0) {
      this.obstacleDownload(obstacles);
    }
  }

  /**
   * Download generated data and set current date and time
   */
  download() {
    this.exportOptions.filename = 'vdg-data-export-' + this.datepipe.transform(Date.now(), 'yyyy-MM-dd HH:mm:ss');
    const csvExporter = new ExportToCsv(this.exportOptions);
    csvExporter.generateCsv(this._exportMoverData);


  }

  /**
   * Download paths
   * @param data path export definition and set current date and time
   */
  pathDownload(data: ExportPathData[]) {
    this.exportOptions.filename = 'vdg-path-export-' + this.datepipe.transform(Date.now(), 'yyyy-MM-dd HH:mm:ss');
    const csvExporter = new ExportToCsv(this.exportOptions);
    csvExporter.generateCsv(data);
  }

    /**
   * Download obstacles and set current date and time
   * @param data obstacle
   */
  obstacleDownload(data: Obstacle[]) {
    this.exportOptions.filename = 'vdg-obstacle-export-' + this.datepipe.transform(Date.now(), 'yyyy-MM-dd HH:mm:ss');
    const csvExporter = new ExportToCsv(this.exportOptions);
    csvExporter.generateCsv(data);
  }
}
