import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerComponent } from './manager.component';
import { SharedModule } from '@shared/shared.module';
import { ManagerProfileComponent } from './pages/manager-profile/manager-profile.component';

@NgModule({
    declarations: [ManagerComponent, ManagerProfileComponent],
    imports: [
        CommonModule,
        //Angular Material
        MatTabsModule,
        MatIconModule,
        // My Modules
        SharedModule,
        ManagerRoutingModule,
    ],
})
export class ManagerModule {}
