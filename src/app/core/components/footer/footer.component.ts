import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector';
import OGCMapTile from 'ol/source/OGCMapTile';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import * as proj from 'ol/proj';
import { ViewChild, ElementRef } from '@angular/core';
import Overlay from 'ol/Overlay';
import * as interaction from 'ol/interaction';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
    etfCoords = [20.476236, 44.805715];
    map: Map;
    constructor() {}

    ngOnInit() {
        this.map = new Map({
            interactions: interaction.defaults({ mouseWheelZoom: false }),

            target: 'house-media-map',
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: olProj.fromLonLat(this.etfCoords),
                zoom: 17,
                minZoom: 5,
                maxZoom: 19,
            }),
        });

        var markers = new VectorLayer({
            source: new VectorSource(),
            style: new Style({
                image: new Icon({
                    anchor: [0.5, 1],
                    scale: 0.1,
                    src: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png',
                }),
            }),
        });
        this.map.addLayer(markers);

        var marker = new Feature(new Point(olProj.fromLonLat(this.etfCoords)));
        markers.getSource().addFeature(marker);
    }
}
