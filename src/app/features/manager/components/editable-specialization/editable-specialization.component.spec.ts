import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableSpecializationComponent } from './editable-specialization.component';

describe('EditableSpecializationComponent', () => {
    let component: EditableSpecializationComponent;
    let fixture: ComponentFixture<EditableSpecializationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditableSpecializationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditableSpecializationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
