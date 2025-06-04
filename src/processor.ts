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

    public updateFormattingSettings(dataView: powerbi.DataView): void {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, dataView);
    }

    public getWKTStrings(dataView: powerbi.DataView): string[] {
        return dataView.table?.rows?.map(row => row[0].toString()) || [];
    }

    public createFeatureCollection(wktStrings: string[]): any {
        return {
            type: "FeatureCollection",
            features: wktStrings.map((wkt) => ({
                type: "Feature",
                geometry: wktToGeoJSON(wkt),
            }))
        };
    }
}