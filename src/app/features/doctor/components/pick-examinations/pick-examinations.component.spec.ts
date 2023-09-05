import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickExaminationsComponent } from './pick-examinations.component';

describe('PickExaminationsComponent', () => {
  let component: PickExaminationsComponent;
  let fixture: ComponentFixture<PickExaminationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickExaminationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickExaminationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
