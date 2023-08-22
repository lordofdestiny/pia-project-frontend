import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AboutImage, AboutImageService } from './services/about-images.service';
import {
    ImageData,
    GalleryImagesService,
} from './services/gallery-images.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css'],
    providers: [GalleryImagesService, AboutImageService],
})
export class WelcomeComponent implements OnInit {
    readonly isHandset$: Observable<boolean> = this.breakpointObserver
        .observe(Breakpoints.Handset)
        .pipe(
            map((result) => result.matches),
            shareReplay()
        );

    readonly gallery_images: Array<ImageData> = this.galleryImageList
        .getGallery()
        .shuffle();

    constructor(
        private breakpointObserver: BreakpointObserver,
        private galleryImageList: GalleryImagesService
    ) {}

    ngOnInit(): void {}
}
