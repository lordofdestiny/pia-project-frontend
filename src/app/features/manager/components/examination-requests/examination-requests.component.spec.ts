import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationRequestsComponent } from './examination-requests.component';

describe('ExaminationRequestsComponent', () => {
  let component: ExaminationRequestsComponent;
  let fixture: ComponentFixture<ExaminationRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExaminationRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
