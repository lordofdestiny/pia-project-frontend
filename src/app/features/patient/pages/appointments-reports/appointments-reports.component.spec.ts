import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsReportsComponent } from './appointments-reports.component';

describe('AppointmentsReportsComponent', () => {
  let component: AppointmentsReportsComponent;
  let fixture: ComponentFixture<AppointmentsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentsReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
