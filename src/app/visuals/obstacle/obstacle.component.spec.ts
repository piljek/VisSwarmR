import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObstacleComponent } from './obstacle.component';

describe('ObstacleComponent', () => {
  let component: ObstacleComponent;
  let fixture: ComponentFixture<ObstacleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObstacleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObstacleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
