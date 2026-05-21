import type {ColDef} from "ag-grid-community"
import {useMemo} from "react"
import DigimonNameRenderer from "./renderers/DigimonNameRenderer.tsx"
import {DIGI_DEVICE_COLUMNS, type DigiRow} from "./digiConstantsAndTypes.ts"
import AGGridHeader from "../../global/AGGridHeader.tsx"

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
            field: col.sprite,
            colId: `${col.version}_${col.sprite}`,
            headerComponent: AGGridHeader,
            headerComponentParams: {
                useEllipses: false
            },
            resizable: false,
            sortable: false,
            cellRenderer: col.renderer,
            cellRendererParams: {
                deviceVersion: col.version,
                image: col.image,
                animationsPaused: animationsPaused
            },
            width: col.width
        }))
        return [staticColumn, ...dynamicColumns]
    }, [animationsPaused, isPhone, themeMode])
}
