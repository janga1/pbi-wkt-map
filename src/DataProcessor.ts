"use strict";

import powerbi from "powerbi-visuals-api";
import { Feature, Geometry, FeatureCollection } from "geojson";
import { wktToGeoJSON } from "@terraformer/wkt";
import { VisualFormattingSettingsModel } from "./Settings";

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
                            ): FeatureCollection {
                                
        const features: Feature[] = wktStrings.map((wkt, i) => {
            let geometry: Geometry | null;
            try {
                geometry = wktToGeoJSON(wkt) as Geometry;
            } catch {
                geometry = null;
            }

            const isPoint = geometry?.type === "Point";
            const radius = Math.max(1, settings.pointCard.radius.value ?? 6);

            return {
                type: "Feature",
                geometry,
                properties: {
                    // Geometry
                    fillColor: settings.geometryCard.fillColor.value.value,
                    fillOpacity: 1 - settings.geometryCard.fillTransparency.value / 100,
                    borderColor: settings.geometryCard.borderColor.value.value,
                    borderOpacity: 1 - settings.geometryCard.borderTransparency.value / 100,
                    borderWidth: settings.geometryCard.borderThickness.value,

                    // Tooltip
                    tooltipFontSize: settings.tooltipCard.fontSize.value,
                    tooltipFontColor: settings.tooltipCard.fontColor.value.value,
                    tooltipBackgroundColor: settings.tooltipCard.backgroundColor.value.value,
                    tooltipBackgroundOpacity: 1 - settings.tooltipCard.backgroundTransparency.value / 100,
                    tooltipTextAlign: settings.tooltipCard.textAlign.value,

                    // Label
                    labelFontSize: settings.labelCard.fontSize.value,
                    labelFontColor: settings.labelCard.fontColor.value.value,
                    labelBackgroundColor: settings.labelCard.backgroundColor.value.value,
                    labelBackgroundOpacity: 1 - settings.labelCard.backgroundTransparency.value / 100,
                    labelTextAlign: settings.labelCard.textAlign.value,

                    // Point
                    pointRadius: isPoint ? radius : undefined,
                    pointFillColor: settings.pointCard.fillColor.value.value,
                    pointFillOpacity: 1 - settings.pointCard.fillTransparency.value / 100,
                    pointBorderColor: settings.pointCard.borderColor.value.value,
                    pointBorderOpacity: 1 - settings.pointCard.borderTransparency.value / 100,
                    pointBorderWidth: settings.pointCard.borderThickness.value,

                    // Data
                    labels: labelStrings[i] ?? [],
                    tooltips: tooltipStrings[i] ?? [],
                    error: geometry === null ? "Invalid WKT" : undefined
                }
            };
        });

        return {
            type: "FeatureCollection",
            features
        };
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