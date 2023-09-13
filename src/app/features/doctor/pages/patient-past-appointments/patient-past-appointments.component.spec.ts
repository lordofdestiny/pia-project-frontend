import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPastAppointmentsComponent } from './patient-past-appointments.component';

describe('PatientPastAppointmentsComponent', () => {
  let component: PatientPastAppointmentsComponent;
  let fixture: ComponentFixture<PatientPastAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientPastAppointmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientPastAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
