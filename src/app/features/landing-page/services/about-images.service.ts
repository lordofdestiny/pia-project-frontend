import { Injectable } from '@angular/core';

import { ImageData } from '@core/models/image-data';
import gallery from '@assets/images/about/about.json';

export interface ImageText {
    title: string;
    text: string;
    link_text?: string;
    link?: string;
}

export interface AboutImage extends ImageData, ImageText {}

const about_text: ImageText[] = [
    {
        title: 'Healing starts here\nThe right answers the first time',
        text: 'The right answers the first time. Effective treatment depends on getting the right diagnosis. Our experts diagnose and treat the toughest medical challenges.',
    },
    {
        title: 'We help you leave all the pain behind...\n Top-ranked in Serbia',
        text: 'House Medic has more No. 1 rankings than any other hospital in the nation according to Serbian News & World Report. ',
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

@Injectable({
    providedIn: 'any',
})
export class AboutImageService {
    private images: Array<AboutImage> = gallery.map(({ name, alt }, index) => ({
        path: `assets/images/about/${name}`,
        alt,
        ...about_text[index % about_text.length],
    }));

    getGallery() {
        return this.images;
    }
}
