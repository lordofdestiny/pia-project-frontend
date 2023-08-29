import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import Icon from 'ol/style/Icon';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector';
import VectorImageLayer from 'ol/layer/VectorImage';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit, AfterViewInit {
    locationMap: Map;
    isOnline: BehaviorSubject<boolean> = new BehaviorSubject(true);

    private etfGeoCoords = [20.476236, 44.805715];
    private etfMapCoords = fromLonLat(this.etfGeoCoords);
    private marker_img =
        'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png';

    constructor() {}

    ngOnInit() {}

    ngAfterViewInit(): void {
        this.locationMap = this.makeMap();
    }

    makeMap() {
        return new Map({
            target: 'house-media-map',
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                new VectorImageLayer({
                    source: new VectorSource({
                        features: [new Feature(new Point(this.etfMapCoords))],
                    }),
                    style: new Style({
                        image: new Icon({
                            anchor: [0.5, 1],
                            scale: 0.1,
                            src: this.marker_img,
                        }),
                    }),
                }),
            ],
            view: new View({
                center: this.etfMapCoords,
                zoom: 17,
                minZoom: 5,
                maxZoom: 19,
            }),
        });
    }
}
