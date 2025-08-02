"use strict";

import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FeatureCollection } from "geojson";

const DEFAULT_LOCATION: L.LatLngExpression = [51.562319, 4.783870];
const DEFAULT_ZOOM = 15;
const TILES_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export class MapService {
  private map: L.Map;
  private geometryLayer: L.Layer | null = null;

  constructor(container: HTMLElement) {
    this.map = this.initMap(container);
  }

  private initMap(container: HTMLElement): L.Map {
    const div = document.createElement("div");
    div.id = "leaflet-map";
    div.style.width = "100%";
    div.style.height = "100%";
    container.appendChild(div);

    const map = L.map(div).setView(DEFAULT_LOCATION, DEFAULT_ZOOM);
    map.attributionControl.setPrefix("");
    L.tileLayer(TILES_URL, { attribution: ATTRIBUTION }).addTo(map);
    return map;
  }

  public removeMap(): void {
    this.map.remove();
  }

  public removeGeometries(): void {
    if (this.geometryLayer) {
      this.map.removeLayer(this.geometryLayer);
      this.geometryLayer = null;
    }
  }

  public addGeometries(featureCollection: FeatureCollection): void {
    this.removeGeometries();

    const geoJsonLayer = L.geoJSON(featureCollection, {
      pointToLayer: (_, latlng) =>
        L.circleMarker(latlng, {
          radius: 6,
          fillColor: "#3388ff",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.6,
        }),
    });

    this.geometryLayer = geoJsonLayer;
    geoJsonLayer.addTo(this.map);

    try {
      this.map.flyToBounds(geoJsonLayer.getBounds());
    } catch {
      this.map.setView(DEFAULT_LOCATION, DEFAULT_ZOOM);
    }
  }
}