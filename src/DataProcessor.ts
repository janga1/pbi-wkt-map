import powerbi from "powerbi-visuals-api";
import { valueFormatter } from "powerbi-visuals-utils-formattingutils";

type ColumnInfo = {
    columnName: string;
    displayName: string;
    primitiveType?: string;
    formatString?: string;
    values: (string | number | boolean | Date)[];
};

type DataObject = {
    [roleName: string]: {
        columns: ColumnInfo[];
    };
};

export class DataProcessor {
    private dataObject: DataObject = {};
    private locale: string;

    constructor(dataView: powerbi.DataView, host: powerbi.extensibility.visual.IVisualHost) {
        this.locale = host.locale;
        this.buildDataObject(dataView);
    }

    public getDisplayNames(role: string): string[] {
        return this.dataObject[role]?.columns.map((col) => col.displayName) ?? [];
    }

    public getValues(role: string): (string | number | boolean | Date)[][] {
        return this.dataObject[role]?.columns.map((col) => col.values) ?? [];
    }

    public getValuesAsStrings(role: string): string[][] {
        const columns = this.dataObject[role]?.columns ?? [];
        return columns.map((col) => col.values.map((val) => val as string));
    }

    public getValuesFormatted(role: string): string[][] {
        const columns = this.dataObject[role]?.columns ?? [];
        return columns.map((col) =>
            col.values.map((val) => this.formatValue(val, col.formatString))
        );
    }

    public getValuesAtIndex(role: string, idx: number): (string | number | boolean | Date)[] {
        return this.dataObject[role]?.columns.map((col) => col.values[idx]) ?? [];
    }

    public getValuesFormattedAtIndex(role: string, idx: number): string[] {
        const columns = this.dataObject[role]?.columns ?? [];
        return columns.map((col) => this.formatValue(col.values[idx], col.formatString));
    }

    private buildDataObject(dataView: powerbi.DataView): void {
        const categorical = dataView?.categorical;
        if (!categorical) return;

        const allColumns = [...(categorical.categories ?? []), ...(categorical.values ?? [])];

        for (const col of allColumns) {
            const roleNames = Object.keys(col.source.roles ?? {});

            for (const roleName of roleNames) {
                if (!this.dataObject[roleName]) {
                    this.dataObject[roleName] = { columns: [] };
                }

                const alreadyAdded = this.dataObject[roleName].columns.some(
                    (existing) => existing.columnName === col.source.queryName
                );

                if (!alreadyAdded) {
                    this.dataObject[roleName].columns.push({
                        columnName: col.source.queryName,
                        displayName: col.source.displayName,
                        primitiveType: DataProcessor.getColumnType(col.source.type),
                        formatString: col.source.format,
                        values: col.values,
                    });
                }
            }
        }
    }

    private static getColumnType(type: powerbi.ValueTypeDescriptor): string {
        if (type.text) return "Text";
        if (type.numeric) return "Numeric";
        if (type.integer) return "Integer";
        if (type.bool) return "Boolean";
        if (type.dateTime) return "DateTime";
        if (type.duration) return "Duration";
        if (type.binary) return "Binary";

        if (type.geography?.latitude) return "Latitude";
        if (type.geography?.longitude) return "Longitude";
        if (type.misc?.imageUrl) return "ImageUrl";
        if (type.misc?.webUrl) return "WebUrl";

        return "Unknown";
    }

    private formatValue(value: any, formatString?: string): string {
        if (value == null) return "";

        if (formatString) {
            const formatter = valueFormatter.create({
                format: formatString,
                cultureSelector: this.locale,
            });
            return formatter.format(value);
        }

        if (value instanceof Date) return value.toISOString();
        return value.toString();
    }
}
