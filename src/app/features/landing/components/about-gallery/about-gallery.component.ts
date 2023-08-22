import { Component, Input, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

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

    isHandset$: Observable<boolean> = this.breakpointObserver
        .observe(Breakpoints.Handset)
        .pipe(
            map((result) => result.matches),
            shareReplay()
        );

    constructor(
        private breakpointObserver: BreakpointObserver,
        private aboutImageService: AboutImageService
    ) {}

    ngOnInit(): void {
        this.about_data = this.aboutImageService.getGallery().shuffle();
    }
}
