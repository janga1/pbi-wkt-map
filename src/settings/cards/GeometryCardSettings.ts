// import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";


// export class GeometryCardSettings extends formattingSettings.SimpleCard {
//     fillColor = new formattingSettings.ColorPicker({
//         name: "fillColor",
//         displayName: "Fill Color",
//         instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
//         value: { value: "#0000FF" }
//     });

//     borderColor = new formattingSettings.ColorPicker({
//         name: "borderColor",
//         displayName: "Border Color",
//         instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
//         value: { value: "#000000" }
//     });

//     borderThickness = new formattingSettings.Slider({
//         name: "borderThickness",
//         displayName: "Border Thickness",
//         options: {
//             minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
//             maxValue: { value: 25, type: powerbi.visuals.ValidatorType.Max }
//         },
//         value: 2
//     });

//     fillTransparency = new formattingSettings.Slider({
//         name: "fillTransparency",
//         displayName: "Fill Transparency",
//         options: {
//             minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
//             maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max }
//         },
//         value: 60
//     });

//     borderTransparency = new formattingSettings.Slider({
//         name: "borderTransparency",
//         displayName: "Border Transparency",
//         options: {
//             minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
//             maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max }
//         },
//         value: 100
//     });

//     name = "geometryCard";
//     displayName = "Geometry Styling";
//     slices: formattingSettings.Slice[] = [
//         this.fillColor,
//         this.fillTransparency,
//         this.borderColor,
//         this.borderTransparency,
//         this.borderThickness
//     ];
// }


import powerbi from "powerbi-visuals-api";
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

export class GeometryCardSettings extends formattingSettings.SimpleCard {
  // Voor vlakken en lijnen
  fillColor = new formattingSettings.ColorPicker({
    name: "fillColor",
    displayName: "Fill Color",
    instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
    value: { value: "#0000FF" }
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

  borderColor = new formattingSettings.ColorPicker({
    name: "borderColor",
    displayName: "Border Color",
    instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
    value: { value: "#000000" }
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

  borderThickness = new formattingSettings.Slider({
    name: "borderThickness",
    displayName: "Border Thickness",
    options: {
      minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
      maxValue: { value: 25, type: powerbi.visuals.ValidatorType.Max }
    },
    value: 2
  });

  // Voor punten (samengevoegd)
  pointRadius = new formattingSettings.Slider({
    name: "pointRadius",
    displayName: "Point Radius",
    options: {
      minValue: { value: 1, type: powerbi.visuals.ValidatorType.Min },
      maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max }
    },
    value: 6
  });

  pointFillColor = new formattingSettings.ColorPicker({
    name: "pointFillColor",
    displayName: "Point Fill Color",
    instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
    value: { value: "#0000FF" }
  });

  pointFillTransparency = new formattingSettings.Slider({
    name: "pointFillTransparency",
    displayName: "Point Fill Transparency",
    options: {
      minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
      maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max }
    },
    value: 30
  });

  pointBorderColor = new formattingSettings.ColorPicker({
    name: "pointBorderColor",
    displayName: "Point Border Color",
    instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule,
    value: { value: "#000000" }
  });

  pointBorderTransparency = new formattingSettings.Slider({
    name: "pointBorderTransparency",
    displayName: "Point Border Transparency",
    options: {
      minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
      maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max }
    },
    value: 0
  });

  pointBorderThickness = new formattingSettings.Slider({
    name: "pointBorderThickness",
    displayName: "Point Border Thickness",
    options: {
      minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
      maxValue: { value: 25, type: powerbi.visuals.ValidatorType.Max }
    },
    value: 1
  });

  name = "geometryCard";
  displayName = "Geometry Styling";
  slices: formattingSettings.Slice[] = [
    this.fillColor,
    this.fillTransparency,
    this.borderColor,
    this.borderTransparency,
    this.borderThickness,

    this.pointRadius,
    this.pointFillColor,
    this.pointFillTransparency,
    this.pointBorderColor,
    this.pointBorderTransparency,
    this.pointBorderThickness
  ];
}