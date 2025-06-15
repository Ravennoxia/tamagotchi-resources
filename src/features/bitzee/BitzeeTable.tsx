import {AgGridReact} from "ag-grid-react"
import type {AllBitzeeData, BitzeeRow} from "../../global/types.ts"
import {useCallback, useEffect, useRef, useState} from "react"
import type {ColDef, GridOptions, GridReadyEvent} from "ag-grid-community"
import ImageRenderer from "./BitzeeImageRenderer.tsx"
import "../AGGridTable.css"
import "./BitzeeTable.css"

export default function BitzeeTable({themeMode}: { themeMode: string }) {
    const gridRef = useRef<AgGridReact>(null)
    const [rowData, setRowData] = useState<BitzeeRow[]>([])
    const [colDefs] = useState<ColDef<BitzeeRow>[]>([
        {
            field: "gem",
            headerName: "Gem"
        },
        {
            field: "baby",
            headerName: "Baby"
        },
        {
            field: "adult",
            headerName: "Adult"
        },
        {
            field: "superBitzee",
            headerName: "Super Bitzee"
        },
        {
            field: "blue",
            headerName: "Super Bitzee"
        },
        {
            field: "red",
            headerName: "Super Bitzee"
        },
        {
            field: "green",
            headerName: "Super Bitzee"
        }
    ])

    const defaultColDefs: ColDef = {
        cellRenderer: ImageRenderer,
        autoHeight: true,
        resizable: false,
        sortable: false,
        suppressMovable: true,
        cellStyle: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        maxWidth: 152
    }


    const gridOptions: GridOptions<BitzeeRow> = {
        suppressRowHoverHighlight: true,
        suppressCellFocus: true
    }

    const onGridReady = useCallback((params: GridReadyEvent) => {
        if (gridRef.current?.api) {
            params.api.sizeColumnsToFit()
        }
    }, [])

    useEffect(() => {
        const handleResize = () => {
            if (gridRef.current?.api) {
                gridRef.current.api.sizeColumnsToFit()
            }
        }
        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(import.meta.env.BASE_URL + "bitzee-magicals.json")
                if (!response.ok) {
                    // noinspection ExceptionCaughtLocallyJS
                    throw new Error(response.status.toString())
                }
                const data: AllBitzeeData = await response.json()
                const transformedData: BitzeeRow[] = Object.entries(data).map(([name, charData]) => {
                    return {
                        name: name,
                        rarity: charData.rarity,
                        gem: charData.gem,
                        baby: charData.baby,
                        adult: charData.adult,
                        superBitzee: charData.superBitzee,
                        blue: charData.blue,
                        red: charData.red,
                        green: charData.green
                    }
                })
                setRowData(transformedData)
            } catch (error) {
                console.error("Failed to fetch data", error)
                setRowData([])
            }
        }

        fetchData().catch()
    }, [])

    return (
        <div
            className={"padding-bitzee-table"}
            style={{
                display: "flex",
                justifyContent: "center",
                height: "100%"
            }}>
            <div data-ag-theme-mode={themeMode} className={"flex-column-1"}
                 style={{height: "100%", maxWidth: "1081px"}} id="portal-root">
                <div style={{flex: 1, height: "100%"}}>
                    <AgGridReact<BitzeeRow>
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={colDefs}
                        gridOptions={gridOptions}
                        defaultColDef={defaultColDefs}
                        onGridReady={onGridReady}
                    />
                </div>
                <cite style={{textAlign: "right", padding: "10px 0"}}>
                    Sprites drawn based on manual. Potion colors (WIP) approximated from seeing them in real life.
                </cite>
            </div>
        </div>
    )
}
