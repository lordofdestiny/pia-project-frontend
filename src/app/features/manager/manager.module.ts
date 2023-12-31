import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Angular Material
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatBadgeModule } from "@angular/material/badge";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatListModule } from "@angular/material/list";
import { MatSnackBarModule } from "@angular/material/snack-bar";

// Ngx-material-file-input
import { MaterialFileInputModule } from "ngx-material-file-input";

//PrimeNG
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { CalendarModule } from "primeng/calendar";

import { ManagerRoutingModule } from "./manager-routing.module";
import { ManagerComponent } from "./manager.component";
import { SharedModule } from "@shared/shared.module";
import { ManagerProfileComponent } from "./pages/manager-profile/manager-profile.component";
import {
    ManageUsersComponent,
    DeleteUserDialogComponent,
    DoctorCreationDialogComponent,
} from "./pages/manage-users/manage-users.component";
import { CreateDoctorComponent } from "./components/create-doctor/create-doctor.component";
import { SpecializationsComponent } from "./pages/specializations/specializations.component";
import { ExaminationRequestsComponent } from "./components/examination-requests/examination-requests.component";
import {
    EditableSpecializationComponent,
    MessageSnackBar,
} from "./components/editable-specialization/editable-specialization.component";
import { PromotionsComponent } from "./pages/promotions/promotions.component";

@NgModule({
    declarations: [
        ManagerComponent,
        ManagerProfileComponent,
        ManageUsersComponent,
        DeleteUserDialogComponent,
        CreateDoctorComponent,
        DoctorCreationDialogComponent,
        SpecializationsComponent,
        ExaminationRequestsComponent,
        EditableSpecializationComponent,
        MessageSnackBar,
        PromotionsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        //Angular Material
        MatTabsModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatCardModule,
        MatExpansionModule,
        MatPaginatorModule,
        MatBadgeModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTableModule,
        MatListModule,
        MatSnackBarModule,
        // Ngx-material-file-input
        MaterialFileInputModule,
        // PrimeNG
        InputTextModule,
        InputNumberModule,
        CalendarModule,
        // My Modules
        SharedModule,
        ManagerRoutingModule,
    ],
})
export class ManagerModule {}
