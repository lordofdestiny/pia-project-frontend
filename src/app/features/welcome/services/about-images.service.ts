import { Injectable } from '@angular/core';

import { ImageData } from '@core/models/image-data.model';
import gallery from '@assets/images/about/about.json';

@Injectable({
    providedIn: 'any',
})
export class AboutImageService {
    private images: Array<ImageData> = gallery.map(({ name, alt }) => ({
        path: `assets/images/about/${name}`,
        alt,
    }));

    getGallery() {
        return this.images;
    }
}
