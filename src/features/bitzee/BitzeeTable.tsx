import {AgGridReact} from "ag-grid-react"
import type {AllBitzeeData, BitzeeRow} from "../../global/types.ts"
import {useCallback, useEffect, useRef, useState} from "react"
import type {ColDef, GridOptions, GridReadyEvent} from "ag-grid-community"
import ImageRenderer from "./BitzeeImageRenderer.tsx"
import "../../global/AGGridTable.css"
import "./BitzeeTable.css"
import AGGridHeader from "../../global/AGGridHeader.tsx"

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
        // {
        //     field: "blue",
        //     headerName: "Blue Potion"
        // },
        // {
        //     field: "red",
        //     headerName: "Red Potion"
        // },
        {
            field: "green",
            headerName: "Green Potion"
        }
    ])

    const defaultColDefs: ColDef = {
        cellRenderer: ImageRenderer,
        headerComponent: AGGridHeader,
        headerComponentParams: {
            useEllipsis: true
        },
        autoHeight: true,
        resizable: false,
        sortable: false,
        suppressMovable: true,
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
        <div className={"padding-css bitzee-div"}>
            <div data-ag-theme-mode={themeMode} className={"flex-column-1"}
                 style={{maxWidth: "777px"}}> {/*1081*/}
                <div style={{flex: 1}}>
                    <AgGridReact<BitzeeRow>
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={colDefs}
                        gridOptions={gridOptions}
                        defaultColDef={defaultColDefs}
                        onGridReady={onGridReady}
                    />
                </div>
                <cite style={{textAlign: "right"}}>
                    Sprites drawn based on manual. Potion colors (WIP) approximated from seeing them in real life.
                </cite>
            </div>
        </div>
    )
}
