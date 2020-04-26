import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlObstacleComponent } from './control-obstacle.component';

describe('ControlObstacleComponent', () => {
  let component: ControlObstacleComponent;
  let fixture: ComponentFixture<ControlObstacleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlObstacleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlObstacleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
