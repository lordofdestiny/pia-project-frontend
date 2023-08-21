import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeComponent } from './welcome.component';
import { GalleryImagesService } from './services/gallery-images.service';
import { AboutImageService } from './services/about-images.service';

import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { NgImageSliderModule } from 'ng-image-slider';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CarouselComponent } from './components/carousel/carousel.component';
import { AboutGalleryComponent } from './components/about-gallery/about-gallery.component';
import { DoctorListComponent } from '../../shared/components/doctor-list/doctor-list.component';

@NgModule({
    declarations: [
        WelcomeComponent,
        CarouselComponent,
        AboutGalleryComponent,
        DoctorListComponent,
    ],
    providers: [GalleryImagesService, AboutImageService],
    imports: [
        CommonModule,
        MatListModule,
        MatButtonModule,
        MatDividerModule,
        NgImageSliderModule,
        CarouselModule.forRoot(),
    ],
    exports: [WelcomeComponent],
    bootstrap: [WelcomeComponent],
})
export class WelcomeModule {}
