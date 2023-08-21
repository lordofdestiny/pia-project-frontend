import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LayoutModule } from '@angular/cdk/layout';
import { MatRippleModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MainNavComponent } from './main-nav/main-nav.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
    declarations: [MainNavComponent, PageNotFoundComponent],
    providers: [],
    imports: [
        CommonModule,
        RouterModule,
        LayoutModule,
        MatIconModule,
        MatListModule,
        MatSliderModule,
        MatRippleModule,
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatProgressBarModule,
    ],
    exports: [
        MainNavComponent,
        LayoutModule,
        MatIconModule,
        MatListModule,
        MatSliderModule,
        MatRippleModule,
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatProgressBarModule,
    ],
})
export class CoreComponentsModule {}
