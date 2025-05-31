"use strict";

import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_LOCATION: L.LatLngExpression = [51.562319, 4.783870];
const DEFAULT_ZOOM = 17;
const PREFIX_ATTRIBUTION = '';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const TILES_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

export class MapService {
    private map: L.Map;

    constructor(target: HTMLElement) {
        this.initMap(target);
    }

    private initMap(target: HTMLElement) {
        const mapDiv = document.createElement("div");
        mapDiv.id = "map";
        mapDiv.style.width = "100%";
        mapDiv.style.height = "100%";
        target.appendChild(mapDiv);

        this.map = L.map("map").setView(DEFAULT_LOCATION, DEFAULT_ZOOM);
        this.map.attributionControl.setPrefix(PREFIX_ATTRIBUTION);
        L.tileLayer(TILES_URL, { attribution: ATTRIBUTION }).addTo(this.map);
    }

    public updateMap(featureCollection: any) {

        this.map.eachLayer(layer => {
            if (layer instanceof L.GeoJSON) {
                this.map.removeLayer(layer);
            }
        });

        let layer = L.geoJSON(featureCollection, {
            style: feature => ({
                color: feature?.properties.borderColor,
                fillColor: feature?.properties.fillColor,
                weight: feature?.properties.borderWidth,
                opacity: feature?.properties.borderOpacity,
                fillOpacity: feature?.properties.fillOpacity,
            }),
            onEachFeature: (feature, layer) => {
                layer.bindTooltip(feature.properties.tooltip, {
                    permanent: false,
                    direction: "top"
                });
            }
        }).addTo(this.map);

        this.map?.fitBounds(layer.getBounds());
    }
}
