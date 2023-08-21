import { Component, Input, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { ImageData } from '@core/models/image-data.model';
export { ImageData } from '@core/models/image-data.model';

export interface ImageText {
    title: string;
    text: string;
    link_text?: string;
    link?: string;
}

export interface AboutImage extends ImageData, ImageText {}

@Component({
    selector: 'app-about-gallery',
    templateUrl: './about-gallery.component.html',
    styleUrls: ['./about-gallery.component.css'],
})
export class AboutGalleryComponent implements OnInit {
    @Input() images: AboutImage[] = [];

    isHandset$: Observable<boolean> = this.breakpointObserver
        .observe(Breakpoints.Handset)
        .pipe(
            map((result) => result.matches),
            shareReplay()
        );

    constructor(private breakpointObserver: BreakpointObserver) {}

    ngOnInit(): void {}
}
