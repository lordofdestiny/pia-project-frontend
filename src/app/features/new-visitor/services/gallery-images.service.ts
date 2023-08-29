import { Injectable } from '@angular/core';
import gallery from '@assets/images/gallery/gallery.json';

import { ImageData } from '@core/models/image-data';
export { ImageData } from '@core/models/image-data';

@Injectable({
    providedIn: 'any',
})
export class GalleryImagesService {
    private images: Array<ImageData> = gallery.map(({ name, alt }) => ({
        path: `assets/images/gallery/${name}`,
        alt,
    }));

    getGallery() {
        return this.images;
    }
}
