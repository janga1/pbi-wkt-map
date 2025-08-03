"use strict";

import powerbi from "powerbi-visuals-api";
import { Feature, Geometry, FeatureCollection } from "geojson";
import { wktToGeoJSON } from "@terraformer/wkt";
import { VisualFormattingSettingsModel } from "./settings/Settings";

export class DataProcessor {
    /**
     * Haalt WKT-strings op uit de categorische kolom gekoppeld aan de "geometries"-rol.
     */
    public getWKTStrings(dataView: powerbi.DataView): string[] {
        const categories = dataView?.categorical?.categories ?? [];
        const geometries = categories.find(c => c.source?.roles?.geometries);
        return geometries?.values.map(v => v?.toString() ?? "") ?? [];
    }

    /**
     * Convenience wrapper voor labels.
     */
    public getLabelStrings(dataView: powerbi.DataView): string[][] {
        return this.extractCategoryData(dataView, "labels");
    }

    /**
     * Convenience wrapper voor tooltips.
     */
    public getTooltipStrings(dataView: powerbi.DataView): string[][] {
        return this.extractCategoryData(dataView, "tooltips");
    }

    /**
     * Bouwt de GeoJSON FeatureCollection op basis van WKT + data + styling.
     */
    public createFeatureCollection(
                                wktStrings: string[],
                                labelStrings: string[][],
                                tooltipStrings: string[][],
                                settings: VisualFormattingSettingsModel
                            ) {
                                
    }

    /**
     * Haalt alle categorische kolommen per rol ("labels" / "tooltips"),
     * vertaalt alles naar strings, groepeert per rij.
     */
    private extractCategoryData(
        dataView: powerbi.DataView,
        role: "labels" | "tooltips"
    ): string[][] {
        const categories = dataView?.categorical?.categories ?? [];
        const relevant = categories.filter(c => c.source?.roles?.[role]);
        const rowCount = relevant[0]?.values.length ?? 0;
        const result: string[][] = Array.from({ length: rowCount }, () => []);

        relevant.forEach(c => {
            c.values.forEach((val, i) => {
                if (val == null) return;
                const items = Array.isArray(val) ? val : [val];
                items.forEach(item => {
                    const str = item?.toString().trim();
                    if (str) result[i].push(str);
                });
            });
        });

        return result;
    }
}