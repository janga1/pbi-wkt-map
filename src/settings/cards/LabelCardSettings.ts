import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

export class LabelCardSettings extends formattingSettings.SimpleCard {
    fontSize = new formattingSettings.Slider({
        name: "fontSize",
        displayName: "Font Size",
        options: {
            minValue: { value: 8, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 48, type: powerbi.visuals.ValidatorType.Max },
        },
        value: 12,
    });

    fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Font Color",
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
        value: { value: "#000000" },
    });

    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Background Color",
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
        value: { value: "#FFFFFF" },
    });

    backgroundTransparency = new formattingSettings.Slider({
        name: "backgroundTransparency",
        displayName: "Background Transparency",
        options: {
            minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max },
        },
        value: 0,
    });

    textAlign = new formattingSettings.AutoDropdown({
        name: "textAlign",
        displayName: "Text Alignment",
        value: "center",
    });

    name = "labelCard";
    displayName = "Label Styling";
    slices: formattingSettings.Slice[] = [
        this.fontSize,
        this.fontColor,
        this.backgroundColor,
        this.backgroundTransparency,
        this.textAlign,
    ];
}
