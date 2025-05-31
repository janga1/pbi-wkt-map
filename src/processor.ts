"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { VisualFormattingSettingsModel } from "./settings";

import { wktToGeoJSON } from '@terraformer/wkt';

export class DataProcessor {
    public formattingSettingsService: FormattingSettingsService;
    public formattingSettings: VisualFormattingSettingsModel;

    constructor() {
        this.formattingSettingsService = new FormattingSettingsService();
        this.formattingSettings = new VisualFormattingSettingsModel();
    }

    public extractFormattingSettings(dataView: powerbi.DataView): void {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, dataView);
    }

    public extractTooltipData(dataView: powerbi.DataView): { tooltipColumnNames: string[], tooltipValues: string[][] } {
        let tooltipColumnNames: string[] = [];
        let tooltipValues: string[][] = [];

        if (dataView.metadata?.columns) {
            tooltipColumnNames = dataView.metadata.columns
                .filter(col => col.roles?.["tooltip"])
                .map(col => col.displayName);
        }

        if (dataView.table?.rows) {
            dataView.table.rows.forEach(row => {
                let rowTooltips: string[] = [];
                tooltipColumnNames.forEach((colName, colIndex) => {
                    rowTooltips.push(`${colName}: ${row[colIndex + 1]}`);
                });
                tooltipValues.push(rowTooltips);
            });
        }

        return { tooltipColumnNames, tooltipValues };
    }

    public createFeatureCollection(wktStrings: string[], tooltipValues: string[][]): any {
        return {
            type: "FeatureCollection",
            features: wktStrings.map((wkt, index) => ({
                type: "Feature",
                geometry: wktToGeoJSON(wkt),
                properties: {
                    color: this.formattingSettings.geometrieenCard.kleur.value.value,
                    fillOpacity: this.formattingSettings.geometrieenCard.transparantie.value / 100,
                    borderColor: this.formattingSettings.geometrieenCard.randKleur.value.value,
                    weight: this.formattingSettings.geometrieenCard.randDikte.value,
                    borderOpacity: this.formattingSettings.geometrieenCard.randTransparantie.value / 100,
                    // tooltipBackgroundColor = this.formattingSettings.tooltipCard.achtergrondkleur.value.value,
                    tooltip: tooltipValues[index].join("<br>")
                }
            }))
        };
    }
}