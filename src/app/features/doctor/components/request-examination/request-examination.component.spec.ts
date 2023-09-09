import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestExaminationComponent } from './request-examination.component';

describe('RequestExaminationComponent', () => {
  let component: RequestExaminationComponent;
  let fixture: ComponentFixture<RequestExaminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestExaminationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestExaminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
