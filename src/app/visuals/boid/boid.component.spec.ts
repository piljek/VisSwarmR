import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoidComponent } from './boid.component';

describe('BoidComponent', () => {
  let component: BoidComponent;
  let fixture: ComponentFixture<BoidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
