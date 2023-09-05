import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableProfileComponent } from './editable-profile.component';
import { User } from '@core/models/users';

describe('EditableProfileComponent', () => {
    let component: EditableProfileComponent<User>;
    let fixture: ComponentFixture<EditableProfileComponent<User>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditableProfileComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditableProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
