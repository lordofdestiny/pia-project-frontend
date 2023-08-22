import { Component, Input, OnInit } from '@angular/core';

import { ImageData } from '@core/models/image-data.model';
import { GalleryImagesService } from '@features/landing/services/gallery-images.service';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent implements OnInit {
    slides: ImageData[] = [
        {
            path: '/assets/images/gallery/house_6.jpg',
            alt: 'House M.D.',
        },
    ];

    constructor(private galeryImagesService: GalleryImagesService) {
        this.slides = this.galeryImagesService.getGallery().shuffle();
    }

    ngOnInit(): void {}
}
