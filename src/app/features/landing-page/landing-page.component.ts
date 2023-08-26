import { Component, OnInit } from '@angular/core';
import { AboutImageService } from './services/about-images.service';
import {
    ImageData,
    GalleryImagesService,
} from './services/gallery-images.service';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css'],
    providers: [GalleryImagesService, AboutImageService],
})
export class LandingPageComponent implements OnInit {
    readonly gallery_images: Array<ImageData> = this.galleryImageList
        .getGallery()
        .shuffle();

    constructor(private galleryImageList: GalleryImagesService) {}

    ngOnInit(): void {}
}
