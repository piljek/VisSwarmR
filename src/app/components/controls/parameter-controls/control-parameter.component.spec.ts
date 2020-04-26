import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterControlComponent } from './control-parameter.component';

describe('NavigationComponent', () => {
  let component: ParameterControlComponent;
  let fixture: ComponentFixture<ParameterControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
