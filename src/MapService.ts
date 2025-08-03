"use strict";

import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FeatureCollection } from "geojson";

import '../style/visual.css';

const DEFAULT_LOCATION: L.LatLngExpression = [51.562319, 4.783870];
const DEFAULT_ZOOM = 15;
const TILES_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export class MapService {
  private map: L.Map;
  private geometryLayer: L.Layer | null = null;
  private labelLayer: L.LayerGroup | null = null;
  private tooltipLayer: L.LayerGroup | null = null;



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

  public removeLabels(): void {
    if (this.labelLayer) {
      this.map.removeLayer(this.labelLayer);
      this.labelLayer = null;
    }
  }

  public removeTooltips(): void {
    if (this.tooltipLayer) {
      this.map.removeLayer(this.tooltipLayer);
      this.tooltipLayer = null;
    }
  }

  public addGeometries(featureCollection: FeatureCollection): void {

    // ADDING GEOMETRIES LAYER TO THE MAP
    this.removeGeometries();

    // const geoJsonLayer = L.geoJSON(featureCollection, {
    //   pointToLayer: (_, latlng) =>
    //     L.circleMarker(latlng, {
    //       radius: 6,
    //       fillColor: "#3388ff",
    //       color: "#000",
    //       weight: 1,
    //       opacity: 1,
    //       fillOpacity: 0.6,
    //     }),
    // });
    const geoJsonLayer = L.geoJSON(featureCollection, {
      pointToLayer: (feature, latlng) => {
        const marker = L.circleMarker(latlng, {
          radius: 6,
          fillColor: "#3388ff",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.6,
        });

        const tooltipValues = feature.properties?.tooltipData ?? [];
        const tooltipNames = feature.properties?.tooltipNames ?? [];

        if (tooltipValues.length > 0) {
          const tooltipContent = tooltipValues
            .map((val, i) => {
              const name = tooltipNames[i] ?? `Field ${i + 1}`;
              return `<div><strong>${name}:</strong> ${val}</div>`;
            })
            .join("");


          marker.bindTooltip(tooltipContent, {
            direction: "top",
            className: "custom-tooltip",
            permanent: false,
            opacity: 0.9
          });
        }

        return marker;
      }
    });


    this.geometryLayer = geoJsonLayer;
    geoJsonLayer.addTo(this.map);

    // ADDING LABEL LAYER TO THE MAP
    this.removeLabels();
    this.labelLayer = L.layerGroup();

    featureCollection.features.forEach(feature => {
      const labelText = feature.properties?.label;
      if (labelText) {
        const center = L.geoJSON(feature).getBounds().getCenter();

        const label = L.marker(center, {
          icon: new L.DivIcon({
            className: "custom-label",
            html: labelText,
            iconSize: [100, 30], // adjust as needed
            iconAnchor: [50, 15], // center the label
          }),
          interactive: false
        });

        this.labelLayer.addLayer(label);
      }
    });

    this.labelLayer.addTo(this.map);

    // ADD TOOLTIPS LAYER TO MAP

    this.removeTooltips();
    this.tooltipLayer = L.layerGroup();

    featureCollection.features.forEach((feature) => {
      const tooltipValues = feature.properties?.tooltipData;
      if (tooltipValues && tooltipValues.length > 0) {
        const center = L.geoJSON(feature).getBounds().getCenter();
        const tooltipContent = tooltipValues
          .map((val, i) => `<div><strong>Field ${i + 1}:</strong> ${val}</div>`)
          .join("");

        const tooltipMarker = L.marker(center, {
          icon: new L.DivIcon({
            className: "custom-tooltip",
            html: tooltipContent,
            iconSize: [150, 40],
            iconAnchor: [75, 20],
          }),
          interactive: false,
        });

        this.tooltipLayer.addLayer(tooltipMarker);
      }
    });


    // DRAW MAP

    try {
      this.map.flyToBounds(geoJsonLayer.getBounds());
    } catch {
      this.map.setView(DEFAULT_LOCATION, DEFAULT_ZOOM);
    }
  }
}