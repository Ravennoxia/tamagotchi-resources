import "./DigimonTable.css"
import {useEffect, useRef, useState} from "react"
import {AgGridReact} from "ag-grid-react"
import {useDigiColumnDefs} from "./useDigiColumnDefs.ts"
import type {AllDigiData, DigiData, DigiRow} from "./digiConstantsAndTypes.ts"

export default function DigimonTable({themeMode, isPhone, animationsPaused}: {
    themeMode: string,
    isPhone: boolean,
    animationsPaused: boolean
}) {
    const gridRef = useRef<AgGridReact>(null)
    const [rowData, setRowData] = useState<DigiRow[]>([])
    const colDefs = useDigiColumnDefs(themeMode, isPhone, animationsPaused)


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(import.meta.env.BASE_URL + "digimon-data.json")
                if (!response.ok) {
                    // noinspection ExceptionCaughtLocallyJS
                    throw new Error(response.status.toString())
                }
                const data: AllDigiData = await response.json()
                const transformedData: DigiRow[] = Object.entries(data).map(([, charData]) => {
                    return {
                        name: charData.name,
                        image: charData.images[0],
                        versions: charData.versions,
                        spriteDM: getSprite(charData, "DM", 0),
                        spritePen: getSprite(charData, "Pen", 0),
                        spriteDM20: getSprite(charData, "DM20", 0),
                        spritePen20: getSprite(charData, "Pen20", 0),
                        spriteDMX: getSprite(charData, "DMX", 0),
                        spriteDMXcloseUp: getSprite(charData, "DMX", 1),
                        spritePenZ: getSprite(charData, "PenZ", 0),
                        spritePenZcloseUp: getSprite(charData, "PenZ", 1),
                        spriteDMC: getSprite(charData, "DMC", 0),
                        spritePenC: getSprite(charData, "PenC", 0)
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

    return <div className={"padding-css flex-column-1"}>
        <div className={"flex-column-1"} data-ag-theme-mode={themeMode}>
            <div style={{flex: 1}}>
                <AgGridReact<DigiRow>
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={colDefs}
                    gridOptions={{
                        enableCellTextSelection: true,
                        accentedSort: true,
                        rowHeight: 74,
                        rowBuffer: 30,
                        suppressRowHoverHighlight: true,
                        suppressCellFocus: true
                    }}
                />
            </div>
            <cite style={{textAlign: "right"}}>Images and information are from{" "}
                <a href={"https://humulos.com/digimon/"} target="_blank" rel="noopener noreferrer">
                    Digitama Hatchery (Humulos)
                </a>
            </cite>
        </div>
    </div>
}

function getSprite(charData: DigiData, device: string, image: number) {
    return charData.versions.find((v) => v.device === device)?.sprites[image] ?? null
}
