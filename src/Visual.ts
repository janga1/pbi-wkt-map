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

        // data kolommen

        const categoryColumns = dataView.categorical?.categories ?? [];
        const valueColumns = dataView.categorical?.values ?? [];

        // wkts lezen naar string array

        const wktCategory = categoryColumns.find(col => col.source.roles?.geometries);
        const wktStrings = wktCategory?.values?.map(val => String(val)) ?? [];

        // labels tekst of numeriek lezen en samenvoegen in string array

        const labelCategory = categoryColumns.find(col => col.source.roles?.labels);
        const labelCategoryStrings = labelCategory?.values?.map(val => String(val)) ?? [];
        const labelValues = valueColumns.find(col => col.source.roles?.labels);
        const labelValuesStrings = labelValues?.values?.map(val => String(val)) ?? [];

        const labelStrings: string[] = labelCategoryStrings.length > 0 ? labelCategoryStrings : labelValuesStrings;

        // tooltips tekst of numeriek lezen en samenvoegen in string matrix

        // const tooltipCategory = categoryColumns.find(col => col.source.roles?.tooltips);
        // const tooltipCategoryStrings = tooltipCategory?.values?.map(val => String(val)) ?? [];
        // const tooltipValues = valueColumns.find(col => col.source.roles?.tooltips);
        // const tooltipValuesStrings = tooltipValues?.values?.map(val => String(val)) ?? [];

        const tooltipValuesMatrix: string[][] = [];

        // 👉 HIER pakken we ALLE kolommen met role 'tooltips', uit zowel categorieën als values
        const allTooltipColumns = [...categoryColumns, ...valueColumns].filter(
            col => col.source.roles?.tooltips
        );

        // 👉 Zet alle kolomwaarden om naar strings
        const tooltipColumnStrings: string[][] = allTooltipColumns.map(col => col.values.map(val => String(val)));

        // 🧮 Bepaal het aantal rijen (gebaseerd op de langste kolom)
        const rowCount = Math.max(...tooltipColumnStrings.map(col => col.length));

        // 🧩 Bouw de matrix: per rij de tooltipwaarden verzamelen
        for (let i = 0; i < rowCount; i++) {
            const rowTooltips: string[] = [];

            tooltipColumnStrings.forEach(colVals => {
                rowTooltips.push(colVals[i] ?? ""); // defensief: geen undefined
            });

            tooltipValuesMatrix.push(rowTooltips);
        }

        // tooltip colom namen
        const tooltipColumnNames: string[] = allTooltipColumns.map(col => col.source.displayName);


        // feature array maken

        const features: Feature[] = [];

        wktStrings.forEach((wkt, idx) => {
            try {
                const geometry = wktToGeoJSON(wkt) as Geometry;
                const label = labelStrings[idx] ?? "";
                const tooltipData = tooltipValuesMatrix[idx] ?? [];

                features.push({
                    type: "Feature",
                    geometry,
                    properties: {
                        label,
                        tooltipData,
                        tooltipNames: tooltipColumnNames

                    }
                });

            } catch (error) {
                console.warn("WKT parse error:", wkt, error);
            }
        });

        // feature collectie maken

        const featureCollection: FeatureCollection = {
            type: "FeatureCollection",
            features: features
        };

        this.mapService.addGeometries(featureCollection);
        this.mapService.addLabels(featureCollection);
        this.mapService.addTooltips(featureCollection);

    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}