import type {ColDef} from "ag-grid-community"
import {useMemo} from "react"
import DigimonNameRenderer from "./renderers/DigimonNameRenderer.tsx"
import AGGridHeader from "../../global/AGGridHeader.tsx"
import {DIGI_DEVICE_COLUMNS, type DigiRow} from "./digiConstantsAndTypes.ts"

export function useDigiColumnDefs(themeMode: string, isPhone: boolean, animationsPaused: boolean): ColDef[] {
    return useMemo(() => {
        const staticColumn: ColDef<DigiRow> = {
            headerName: "Digimon",
            field: "name",
            cellRenderer: DigimonNameRenderer,
            cellRendererParams: {
                themeMode: themeMode,
                isPhone: isPhone
            },
            pinned: "left",
            unSortIcon: true,
            width: 200,
            cellStyle: {
                justifyContent: "left"
            }
        }
        const dynamicColumns = DIGI_DEVICE_COLUMNS.map(col => ({
            headerName: col.version,
            field: "sprite" + col.version,
            headerComponent: AGGridHeader,
            headerComponentParams: {
                useEllipses: false
            },
            resizable: false,
            sortable: false,
            cellRenderer: col.renderer,
            cellRendererParams: {
                deviceVersion: col.version,
                animationsPaused: animationsPaused
            },
            width: 74
        }))
        return [staticColumn, ...dynamicColumns]
    }, [animationsPaused, isPhone, themeMode])
}
