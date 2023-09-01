import { Component, OnInit } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';

import {
    AboutImage,
    AboutImageService,
} from '@features/landing/services/about-images.service';

@Component({
    selector: 'app-about-gallery',
    templateUrl: './about-gallery.component.html',
    styleUrls: ['./about-gallery.component.css'],
})
export class AboutGalleryComponent implements OnInit {
    about_data: AboutImage[] = [];

    constructor(private aboutImageService: AboutImageService) {
        this.about_data = this.aboutImageService.getGallery().shuffle();
    }

    ngOnInit(): void {}
}
