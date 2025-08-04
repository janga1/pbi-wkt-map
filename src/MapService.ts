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
        })
    });

    this.geometryLayer = geoJsonLayer;
    geoJsonLayer.addTo(this.map);

    try {
      this.map.flyToBounds(geoJsonLayer.getBounds());
    } catch {
      this.map.setView(DEFAULT_LOCATION, DEFAULT_ZOOM);
    }

  }

  public addLabels(featureCollection: FeatureCollection): void {

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

  }

  public addTooltips(featureCollection: FeatureCollection): void {
    this.removeTooltips();
    this.tooltipLayer = L.layerGroup();

    L.geoJSON(featureCollection, {
      pointToLayer: (feature, latlng) => {
        const tooltipValues = feature.properties?.tooltipData ?? [];
        const tooltipNames = feature.properties?.tooltipNames ?? [];

        const tooltipContent = tooltipValues
          .map((val, i) => {
            const name = tooltipNames[i] ?? `Field ${i + 1}`;
            return `<div><strong>${name}:</strong> ${val}</div>`;
          })
          .join("");

        const invisibleCircle = L.circleMarker(latlng, {
          radius: 5, // praktisch onzichtbaar
          opacity: 0,
          fillOpacity: 0,
          weight: 0,
          interactive: true
        }).bindTooltip(tooltipContent, {
          permanent: false,
          sticky: true,
          direction: "auto",
          className: "custom-leaflet-tooltip"
        });

        return invisibleCircle;
      },

      onEachFeature: (feature, layer) => {
        // Voor niet-point geometrieën (zoals Polygon/LineString)
        if (feature.geometry.type !== "Point") {
          const tooltipValues = feature.properties?.tooltipData ?? [];
          const tooltipNames = feature.properties?.tooltipNames ?? [];

          const tooltipContent = tooltipValues
            .map((val, i) => {
              const name = tooltipNames[i] ?? `Field ${i + 1}`;
              return `<div><strong>${name}:</strong> ${val}</div>`;
            })
            .join("");

          layer.bindTooltip(tooltipContent, {
            permanent: false,
            sticky: true,
            direction: "auto",
            className: "custom-leaflet-tooltip"
          });

        }
      }
    }).addTo(this.tooltipLayer);

    this.tooltipLayer.addTo(this.map);
  }


}