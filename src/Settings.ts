"use strict";

import powerbi from "powerbi-visuals-api";
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

// Geometry styling settings
class GeometryCardSettings extends formattingSettings.SimpleCard {
    fillColor = new formattingSettings.ColorPicker({
        name: "fillColor",
        displayName: "Fill Color",
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
        value: { value: "#0000FF" }
    });

    borderColor = new formattingSettings.ColorPicker({
        name: "borderColor",
        displayName: "Border Color",
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
        value: { value: "#000000" }
    });

    borderThickness = new formattingSettings.Slider({
        name: "borderThickness",
        displayName: "Border Thickness",
        options: {
            minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 25, type: powerbi.visuals.ValidatorType.Max }
        },
        value: 2
    });

    fillTransparency = new formattingSettings.Slider({
        name: "fillTransparency",
        displayName: "Fill Transparency",
        options: {
            minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max }
        },
        value: 60
    });

    borderTransparency = new formattingSettings.Slider({
        name: "borderTransparency",
        displayName: "Border Transparency",
        options: {
            minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max }
        },
        value: 100
    });

    name = "geometryCard";
    displayName = "Geometry Styling";
    slices: formattingSettings.Slice[] = [
        this.fillColor,
        this.fillTransparency,
        this.borderColor,
        this.borderTransparency,
        this.borderThickness
    ];
}

// Tooltip styling settings
class TooltipCardSettings extends formattingSettings.SimpleCard {
    fontSize = new formattingSettings.Slider({
        name: "fontSize",
        displayName: "Font Size",
        options: {
            minValue: { value: 8, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 48, type: powerbi.visuals.ValidatorType.Max }
        },
        value: 12
    });

    fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Font Color",
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
        value: { value: "#000000" }
    });

    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Background Color",
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
        value: { value: "#FFFFFF" }
    });

    backgroundTransparency = new formattingSettings.Slider({
        name: "backgroundTransparency",
        displayName: "Background Transparency",
        options: {
            minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max }
        },
        value: 0
    });

    textAlign = new formattingSettings.AutoDropdown({
        name: "textAlign",
        displayName: "Text Alignment",
        value: "center"
    });

    name = "tooltipCard";
    displayName = "Tooltip Styling";
    slices: formattingSettings.Slice[] = [
        this.fontSize,
        this.fontColor,
        this.backgroundColor,
        this.backgroundTransparency,
        this.textAlign
    ];
}

// Label styling settings
class LabelCardSettings extends formattingSettings.SimpleCard {
    fontSize = new formattingSettings.Slider({
        name: "fontSize",
        displayName: "Font Size",
        options: {
            minValue: { value: 8, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 48, type: powerbi.visuals.ValidatorType.Max }
        },
        value: 12
    });

    fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Font Color",
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
        value: { value: "#000000" }
    });

    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Background Color",
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
        value: { value: "#FFFFFF" }
    });

    backgroundTransparency = new formattingSettings.Slider({
        name: "backgroundTransparency",
        displayName: "Background Transparency",
        options: {
            minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max }
        },
        value: 0
    });

    textAlign = new formattingSettings.AutoDropdown({
        name: "textAlign",
        displayName: "Text Alignment",
        value: "center"
    });

    name = "labelCard";
    displayName = "Label Styling";
    slices: formattingSettings.Slice[] = [
        this.fontSize,
        this.fontColor,
        this.backgroundColor,
        this.backgroundTransparency,
        this.textAlign
    ];
}

// Point styling settings
class PointCardSettings extends formattingSettings.SimpleCard {
    radius = new formattingSettings.Slider({
        name: "radius",
        displayName: "Point Radius",
        options: {
            minValue: { value: 1, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max }
        },
        value: 6
    });

    fillColor = new formattingSettings.ColorPicker({
        name: "fillColor",
        displayName: "Point Fill Color",
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
        value: { value: "#0000FF" }
    });

    fillTransparency = new formattingSettings.Slider({
        name: "fillTransparency",
        displayName: "Point Fill Transparency",
        options: {
            minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max }
        },
        value: 30
    });

    borderColor = new formattingSettings.ColorPicker({
        name: "borderColor",
        displayName: "Point Border Color",
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
        value: { value: "#000000" }
    });

    borderTransparency = new formattingSettings.Slider({
        name: "borderTransparency",
        displayName: "Point Border Transparency",
        options: {
            minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max }
        },
        value: 0
    });

    borderThickness = new formattingSettings.Slider({
        name: "borderThickness",
        displayName: "Point Border Thickness",
        options: {
            minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 25, type: powerbi.visuals.ValidatorType.Max }
        },
        value: 1
    });

    name = "pointCard";
    displayName = "Point Styling";
    slices: formattingSettings.Slice[] = [
        this.radius,
        this.fillColor,
        this.fillTransparency,
        this.borderColor,
        this.borderTransparency,
        this.borderThickness
    ];
}

// Master formatting model
export class VisualFormattingSettingsModel extends formattingSettings.Model {
    geometryCard = new GeometryCardSettings();
    tooltipCard = new TooltipCardSettings();
    labelCard = new LabelCardSettings();
    pointCard = new PointCardSettings();

    cards: formattingSettings.SimpleCard[] = [
        this.geometryCard,
        this.tooltipCard,
        this.labelCard,
        this.pointCard
    ];
}
