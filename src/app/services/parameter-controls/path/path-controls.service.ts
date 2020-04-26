import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Path following parameter service
 */
export class ParameterControlPathService {


  constructor() { }
  /**
   * *****************************************
   * Path following parameters
   * *****************************************
   */

  private activateSource = new BehaviorSubject<boolean>(false);
  activateSource$ = this.activateSource.asObservable();

  private pathRadiusSource = new BehaviorSubject<number>(30);
  pathRadiusSource$ = this.pathRadiusSource.asObservable();

  private segmentRadiusSource = new BehaviorSubject<number>(30);
  segmentRadiusSource$ = this.segmentRadiusSource.asObservable();

  private selectedPathSource = new BehaviorSubject<number>(0);
  selectedPathSource$ = this.selectedPathSource.asObservable();

  private segmentStartSource = new BehaviorSubject<number>(1);
  segmentStartSource$ = this.segmentStartSource.asObservable();

  /**
   * *****************************************
   * Observable methods
   * *****************************************
   */

  /**
   * Activate path following
   * @param val boolean
   */
  activate(val: boolean) {
    console.log(`path following activated: ${val}`);
    this.activateSource.next(val);
  }

  /**
   * Path radius has changed
   * @param val radius size
   */
  pathRadiusChanged(val: number) {
    console.log(`path following radius changed: ${val}`);
    this.pathRadiusSource.next(val);
  }

  /**
   * Segment passing radius changed
   * @param val radius size
   */
  segmentRadiusChanged(val: number) {
    console.log(`segment following radius changed: ${val}`);
    this.segmentRadiusSource.next(val);
  }

  /**
   * Path selection changed
   * @param id path id
   */
  selectedPathChanged(id: number) {
    console.log(`path ${id} is selected`);
    this.selectedPathSource.next(id);
  }

  /**
   * Path entrance strategy has changed
   * @param val starting option id
   */
  segmentStartChanged(val: number) {
    this.segmentStartSource.next(val);
  }

}
