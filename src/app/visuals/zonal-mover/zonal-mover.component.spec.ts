import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouzinZonesComponent } from './zonal-mover.component';

describe('CouzinZonesComponent', () => {
  let component: CouzinZonesComponent;
  let fixture: ComponentFixture<CouzinZonesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouzinZonesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouzinZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
