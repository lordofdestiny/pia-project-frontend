import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CarouselModule } from 'ngx-bootstrap/carousel';

import { LandingComponent } from './landing.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { AboutGalleryComponent } from './components/about-gallery/about-gallery.component';

@NgModule({
    declarations: [LandingComponent, CarouselComponent, AboutGalleryComponent],
    imports: [
        CommonModule,
        RouterModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        CarouselModule.forRoot(),
        SharedModule,
    ],
    exports: [LandingComponent, CarouselComponent, AboutGalleryComponent],
})
export class LandingModule {}
