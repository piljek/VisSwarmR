import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPathComponent } from './control-path.component';

describe('ControlPathComponent', () => {
  let component: ControlPathComponent;
  let fixture: ComponentFixture<ControlPathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlPathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
