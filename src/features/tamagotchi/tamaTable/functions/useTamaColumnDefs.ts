import type {ColDef} from "ag-grid-community"
import {useMemo} from "react"
import TamaNameRenderer from "../renderers/TamaNameRenderer.tsx"
import {getImageColumnDef} from "./tamaTableFunctions.ts"
import type {TamaRow} from "../../tamaTypes.ts"
import {TAMA_ALL_DEVICE_COLUMNS, TAMA_COLUMN_NAMES, TAMA_DEVICE_FILTER_OPTIONS} from "../../tamaConstants.ts"

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
            width: isPhone ? 150 : 200,
            cellStyle: {
                justifyContent: "left"
            }
        }
        const dynamicColumns = TAMA_ALL_DEVICE_COLUMNS.filter(col =>
            (col.type === "blackAndWhite" && selectedDeviceOptions.includes(TAMA_DEVICE_FILTER_OPTIONS.blackAndWhite)) ||
            (col.type === "color" && selectedDeviceOptions.includes(TAMA_DEVICE_FILTER_OPTIONS.color)))
            .map(col => getImageColumnDef(col.version as keyof typeof TAMA_COLUMN_NAMES, col.field as keyof TamaRow))
        return [staticColumn, ...dynamicColumns]
    }, [isPhone, selectedDeviceOptions])
}
