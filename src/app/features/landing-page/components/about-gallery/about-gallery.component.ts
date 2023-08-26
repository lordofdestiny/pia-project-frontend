import { Component, Input, OnInit } from '@angular/core';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import {
    AboutImage,
    AboutImageService,
} from '@features/landing-page/services/about-images.service';

@Component({
    selector: 'app-about-gallery',
    templateUrl: './about-gallery.component.html',
    styleUrls: ['./about-gallery.component.css'],
})
export class AboutGalleryComponent implements OnInit {
    about_data: AboutImage[] = [];

    constructor(
        private aboutImageService: AboutImageService,
        private breakpointObserver: BreakpointObserver
    ) {}

    ngOnInit(): void {
        this.about_data = this.aboutImageService.getGallery().shuffle();
    }

    get isSmall$(): Observable<boolean> {
        return this.breakpointObserver.observe(Breakpoints.Small).pipe(
            map((result) => result.matches),
            shareReplay()
        );
    }
}
