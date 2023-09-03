import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorPatientViewComponent } from '@shared/components/user-card-component/user-card-component.component';

describe('DoctorPatientViewComponent', () => {
  let component: DoctorPatientViewComponent;
  let fixture: ComponentFixture<DoctorPatientViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorPatientViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorPatientViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
