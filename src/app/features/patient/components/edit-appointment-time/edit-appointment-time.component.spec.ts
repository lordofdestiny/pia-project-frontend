import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppointmentTimeComponent } from './edit-appointment-time.component';

describe('EditAppointmentTimeComponent', () => {
  let component: EditAppointmentTimeComponent;
  let fixture: ComponentFixture<EditAppointmentTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAppointmentTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAppointmentTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
