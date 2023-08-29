import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageComponent } from './landing-page.component';
import { GalleryImagesService } from './services/gallery-images.service';
import { AboutImageService } from './services/about-images.service';

import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CarouselComponent } from './components/carousel/carousel.component';
import { AboutGalleryComponent } from './components/about-gallery/about-gallery.component';
import { SharedModule } from '@shared/shared.module';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        LandingPageComponent,
        CarouselComponent,
        AboutGalleryComponent,
    ],
    providers: [GalleryImagesService, AboutImageService],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        SharedModule,
        MatListModule,
        MatButtonModule,
        MatDividerModule,

        CarouselModule.forRoot(),
    ],
    exports: [LandingPageComponent],
})
export class LandingModule {}
