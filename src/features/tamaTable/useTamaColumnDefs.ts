import type {ColDef} from "ag-grid-community"
import type {TamaRow} from "../../global/types.ts"
import {useMemo} from "react"
import TamaNameRenderer from "./renderers/TamaNameRenderer.tsx"
import {ALL_DEVICE_COLUMNS, COLUMN_NAMES, DEVICE_FILTER_OPTIONS} from "../../global/constants.ts"
import {getImageColumnDef} from "./tamaTableFunctions.ts"

export function useTamaColumnDefs(isPhone: boolean, selectedDeviceOptions: string[]): ColDef<TamaRow>[] {
    return useMemo(() => {
        const staticColumn: ColDef<TamaRow> = {
            headerName: "Tamagotchi",
            field: "name",
            cellRenderer: TamaNameRenderer,
            cellRendererParams: {
                isPhone: isPhone
            },
            pinned: "left",
            unSortIcon: true,
            width: isPhone ? 150 : 200
        }
        const dynamicColumns = ALL_DEVICE_COLUMNS.filter(col =>
            (col.type === "blackAndWhite" && selectedDeviceOptions.includes(DEVICE_FILTER_OPTIONS.blackAndWhite)) ||
            (col.type === "color" && selectedDeviceOptions.includes(DEVICE_FILTER_OPTIONS.color)))
            .map(col => getImageColumnDef(col.version as keyof typeof COLUMN_NAMES, col.field as keyof TamaRow))
        return [staticColumn, ...dynamicColumns]
    }, [isPhone, selectedDeviceOptions])
}
