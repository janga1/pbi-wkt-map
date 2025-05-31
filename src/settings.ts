"use strict";

import powerbi from "powerbi-visuals-api"; 
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";


class GeometrieenCardSettings extends formattingSettings.SimpleCard {

    kleur = new formattingSettings.ColorPicker({
        name: "kleur",
        displayName: "Kleur",
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
        value: { value: "#0000FF" }
    });

    randKleur = new formattingSettings.ColorPicker({
        name: "randkleur",
        displayName: "Randkleur",
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
        value: { value: "#000000" }
    });

    randDikte = new formattingSettings.Slider({
        name: "randdikte",
        displayName: "Rand Dikte",
        options: {
            minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 25, type: powerbi.visuals.ValidatorType.Max },
        },
        value: 2
    });

    transparantie = new formattingSettings.Slider({
        name: "transparantie",
        displayName: "Transparantie",
        options: {
            minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max },
        },
        value: 60,
    });

    randTransparantie = new formattingSettings.Slider({
        name: "randtransparantie",
        displayName: "Randkleur Transparantie",
        options: {
            minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max },
        },
        value: 100,
    });

    name: string = "geometrieenCard";
    displayName: string = "Geometrieën";
    slices: Array<formattingSettings.Slice> = [
        this.kleur,
        this.transparantie,
        this.randKleur,
        this.randTransparantie,
        this.randDikte,
    ];
}

class TooltipCardSettings extends formattingSettings.SimpleCard {

    achtergrondkleur = new formattingSettings.ColorPicker({
        name: "achtergrondkleur",
        displayName: "Achtergrond Kleur",
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
        value: { value: "#FFFFFF" }
    });

    name: string = "tooltipCard";
    displayName: string = "Tooltip";
    slices: Array<formattingSettings.Slice> = [
        this.achtergrondkleur
    ];
}

export class VisualFormattingSettingsModel extends formattingSettings.Model {
    geometrieenCard = new GeometrieenCardSettings();
    tooltipCard = new TooltipCardSettings();
    cards = [this.geometrieenCard, this.tooltipCard];
}
