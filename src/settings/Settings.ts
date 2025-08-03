"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import { GeometryCardSettings } from "./cards/GeometryCardSettings";
import { TooltipCardSettings } from "./cards/TooltipCardSettings";
import { LabelCardSettings } from "./cards/LabelCardSettings";


export class VisualFormattingSettingsModel extends formattingSettings.Model {
    geometryCard = new GeometryCardSettings();
    tooltipCard = new TooltipCardSettings();
    labelCard = new LabelCardSettings();

    cards: formattingSettings.SimpleCard[] = [
        this.geometryCard,
        this.tooltipCard,
        this.labelCard
    ];
}
