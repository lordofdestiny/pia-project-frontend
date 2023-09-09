import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';

import { DoctorRoutingModule } from './doctor-routing.module';
import { DoctorComponent } from './doctor.component';
import { DoctorProfileComponent } from './pages/doctor-profile/doctor-profile.component';
import { SharedModule } from '@shared/shared.module';
import { PickExaminationsComponent } from './components/pick-examinations/pick-examinations.component';
import {
    ExaminationsListButtonsDirective,
    ExaminationsListComponent,
} from './components/examinations-list/examinations-list.component';
import { MiscellaneousComponent } from './pages/miscellaneous/miscellaneous.component';
import { RequestExaminationComponent } from './components/request-examination/request-examination.component';
import {
    DatepickerHeader,
    VacationsComponent,
} from './components/vacations/vacations.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
    declarations: [
        DoctorComponent,
        DoctorProfileComponent,
        PickExaminationsComponent,
        ExaminationsListComponent,
        ExaminationsListButtonsDirective,
        MiscellaneousComponent,
        RequestExaminationComponent,
        VacationsComponent,
        DatepickerHeader,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        //Angular material
        MatTabsModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatTableModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatListModule,
        MatDividerModule,
        //My modules
        SharedModule,
        DoctorRoutingModule,
    ],
})
export class DoctorModule {}
