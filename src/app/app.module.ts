import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  MatFormFieldModule, MatSelectModule, MatSidenavModule,
  MatExpansionModule, MatInputModule, MatCardModule,
  MatTableModule, MatSliderModule, MatListModule,
  MatDividerModule, MatCheckboxModule, MatSlideToggleModule,
  MatGridListModule, MatButtonModule, MatButtonToggleModule,
  MatRadioModule, MatIconModule, MatProgressSpinnerModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { ArenaComponent } from './components/arena/arena.component';
import { ControllerComponent } from './components/controller/controller.component';
import { ObstacleComponent } from './visuals/obstacle/obstacle.component';
import { MoverComponent } from './visuals/mover/mover.component';
import { ParameterControlComponent } from './components/controls/parameter-controls/control-parameter.component';
import { CouzinZonesComponent } from './visuals/zonal-mover/zonal-mover.component';
import { ResizedDirective } from './shared/resized.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { BoidComponent } from './visuals/boid/boid.component';
import { PathComponent } from './visuals/path/path.component';
import { SegmentComponent } from './visuals/path/segment/segment.component';
import { ControlPathComponent } from './components/controls/control-path/control-path.component';
import { DatePipe } from '@angular/common';
import { ControlObstacleComponent } from './components/controls/control-obstacle/control-obstacle.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    ArenaComponent,
    ControllerComponent,
    ObstacleComponent,
    MoverComponent,
    ParameterControlComponent,
    CouzinZonesComponent,
    ResizedDirective,
    BoidComponent,
    PathComponent,
    SegmentComponent,
    ControlPathComponent,
    ControlObstacleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSidenavModule,
    MatExpansionModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatSliderModule,
    MatListModule,
    MatDividerModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatIconModule,
    HttpClientModule,
    MatProgressSpinnerModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
