import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DoctorPatientViewComponent } from "@features/patient/pages/doctor-patient-view/doctor-patient-view.component";

describe("DoctorPatientViewComponent", () => {
    let component: DoctorPatientViewComponent;
    let fixture: ComponentFixture<DoctorPatientViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DoctorPatientViewComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DoctorPatientViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
