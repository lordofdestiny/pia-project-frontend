import { Component, Input, OnInit } from '@angular/core';

import { ImageData } from '@core/models/image-data.model';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent implements OnInit {
    @Input() slides: ImageData[] = [
        {
            path: '/assets/images/gallery/house_6.jpg',
            alt: 'House M.D.',
        },
    ];

    constructor() {}

    ngOnInit(): void {}
}
