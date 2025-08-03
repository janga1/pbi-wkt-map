"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { VisualFormattingSettingsModel } from "./settings/Settings";
import { MapService } from "./MapService";
import { wktToGeoJSON } from "@terraformer/wkt";
import { Feature, FeatureCollection, Geometry } from "geojson";

export class Visual implements powerbi.extensibility.visual.IVisual {
    private formattingSettingsService: FormattingSettingsService;
    private formattingSettings: VisualFormattingSettingsModel;
    private mapService: MapService;

    constructor(options: powerbi.extensibility.visual.VisualConstructorOptions) {
        this.formattingSettingsService = new FormattingSettingsService();
        this.formattingSettings = new VisualFormattingSettingsModel();
        this.mapService = new MapService(options.element);
    }

    public update(options: powerbi.extensibility.visual.VisualUpdateOptions): void {
        if (!options.dataViews || options.dataViews.length === 0) {
            this.mapService.removeGeometries();
            return;
        }

        const dataView = options.dataViews[0];

        this.mapService.removeGeometries();
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
            VisualFormattingSettingsModel,
            dataView
        );

        // const category = dataView.categorical?.categories?.[0];
        // const wktStrings = category?.values?.map(val => String(val)) ?? [];
        // const labelValues = dataView.categorical?.categories?.[0]?.values ?? [];
        // Veronderstel dat er minstens twee categorische kolommen zijn
        const categories = dataView.categorical?.categories ?? [];

        // Neem aan: 
        // - categories[0] bevat WKT strings
        // - categories[1] bevat label strings

        const wktCategory = categories[0];
        const labelCategory = categories[1];

        const wktStrings = wktCategory?.values?.map(val => String(val)) ?? [];
        const labelValues = labelCategory?.values?.map(val => String(val)) ?? [];

        const features: Feature[] = [];

        wktStrings.forEach((wkt, idx) => {
            try {
                const geometry = wktToGeoJSON(wkt) as Geometry;
                const label = String(labelValues[idx] ?? "");

                features.push({
                type: "Feature",
                geometry: geometry,
                properties: {
                    label: label
                }
                });
            } catch (error) {
                console.warn("WKT parse error:", wkt, error);
            }
        });


        const featureCollection: FeatureCollection = {
            type: "FeatureCollection",
            features: features
        };

        this.mapService.addGeometries(featureCollection);
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}