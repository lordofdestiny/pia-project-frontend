import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import {
    ImageData,
    ImageText,
    AboutImage,
} from './components/about-gallery/about-gallery.component';
import { AboutImageService } from './services/about-images.service';
import { GalleryImagesService } from './services/gallery-images.service';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css'],
    providers: [GalleryImagesService, AboutImageService],
})
export class WelcomeComponent implements OnInit {
    readonly about_text: ImageText[] = [
        {
            title: 'Healing starts here\nThe right answers the first time',
            text: 'The right answers the first time.\n Effective treatment depends on getting the right diagnosis. Our experts diagnose and treat the toughest medical challenges.',
        },
        {
            title: 'We help you leave all the pain behind\n... Top-ranked in Serbia',
            text: 'House Medic has more No. 1 rankings than any other hospital in the nation according to Serbian News & World Report. ',
            link_text: 'Learn more about our top-ranked specialists.',
            link: '#doctors',
        },
        {
            title: 'World-class care for global patients',
            text: 'We make it easy for patients around the world to get care from House Medic. Our Global Patient Services team is here to help international and out-of-area families every step of the way.',
        },
        {
            title: 'Transformation is here',
            text: 'Cutting edge medical technology and research is happening at House Medic. We are transforming the future of health care.',
        },
    ];
    readonly gallery_images: Array<ImageData> = [];
    readonly about_images_text: Array<AboutImage> = [];

    isHandset$: Observable<boolean> = this.breakpointObserver
        .observe(Breakpoints.Handset)
        .pipe(
            map((result) => result.matches),
            shareReplay()
        );

    constructor(
        private breakpointObserver: BreakpointObserver,
        private galleryImageList: GalleryImagesService,
        private aboutImageList: AboutImageService
    ) {
        this.gallery_images = galleryImageList.getGallery().shuffle();
        this.about_images_text = aboutImageList
            .getGallery()
            .shuffle()
            .zip(this.about_text)
            .map(([image, text]) => ({ ...image, ...text }));
    }
    ngOnInit(): void {}
}
