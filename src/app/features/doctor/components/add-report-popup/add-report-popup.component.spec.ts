import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReportPopupComponent } from './add-report-popup.component';

describe('AddReportPopupComponent', () => {
  let component: AddReportPopupComponent;
  let fixture: ComponentFixture<AddReportPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReportPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReportPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
