import type {TamaRow, VersionData} from "../../../global/types.ts"
import {ALL_DEVICE_COLUMNS, COLUMN_NAMES} from "../../../global/constants.ts"
import type {ColDef} from "ag-grid-community"
import AGGridHeader from "../../../global/AGGridHeader.tsx"
import TamaCellRenderer from "../renderers/TamaCellRenderer.tsx"

export function getVersionSprite(versions: VersionData[], name: string): string | null {
    const v = versions.find((v) => v.version === name)
    if (v) {
        return v.sprite
    }
    return null
}

export function getImageColumnDef(version: keyof typeof COLUMN_NAMES, field: keyof TamaRow): ColDef<TamaRow> {
    const [shortName, longName] = COLUMN_NAMES[version] ?? ["", ""]
    return {
        headerName: shortName,
        field: field,
        headerComponent: AGGridHeader,
        headerComponentParams: {
            tooltip: longName,
            useEllipses: false
        },
        filter: false,
        getQuickFilterText: () => {
            return ""
        },
        resizable: false,
        sortable: false,
        cellRenderer: TamaCellRenderer,
        cellRendererParams: {
            deviceVersion: version
        },
        width: 52
    }
}

export function populateSpriteProperties(
    row: Partial<TamaRow>,
    versions: VersionData[],
    deviceColumns: typeof ALL_DEVICE_COLUMNS
): void {
    deviceColumns.forEach(({version, field}) => {
        (row as Record<string, string | null>)[field] = getVersionSprite(versions, version)
    })
}

export function isPartialSelection(selected: string[], allOptions: Record<string, string>) {
    return selected.length > 0 && selected.length < Object.keys(allOptions).length
}

export function isNoneSelected(selected: string[]) {
    return selected.length === 0
}

export function checkFilterPasses<T>(
    items: T[],
    selectedOptions: string[],
    allOptions: Record<string, string>,
    getValueToFilter: (item: T) => string | string[] | undefined | null,
    specificLogic?: (selected: string[], all: string[]) => boolean
): boolean {
    if (items.length === 0) {
        return false
    }
    const itemValues = Array.from(new Set(
        items.flatMap(getValueToFilter)
            .filter(val => val !== undefined && val !== null && val !== "") as string[]
    ))
    if (selectedOptions.length === Object.keys(allOptions).length) {
        return true
    }
    if (selectedOptions.length === 0) {
        return false
    }
    if (specificLogic) {
        return specificLogic(selectedOptions, itemValues)
    }
    return itemValues.some(val => selectedOptions.includes(val))
}

export function updateFilters(value: string, checked: boolean, prevFilters: string[]) {
    if (checked) {
        return [...prevFilters, value]
    }
    return prevFilters.filter(filter => filter !== value)
}
