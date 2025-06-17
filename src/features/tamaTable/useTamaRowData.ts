import {useEffect, useState} from "react"
import type {AllTamaData, TamaRow} from "../../global/types"
import {populateSpriteProperties} from "./tamaTableFunctions.ts"
import {ALL_DEVICE_COLUMNS} from "../../global/constants.ts"

export function useTamaData() {
    const [rowData, setRowData] = useState<TamaRow[]>([])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(import.meta.env.BASE_URL + "tamagotchi-data.json")
                if (!response.ok) {
                    const errorMessage = `HTTP error! status: ${response.status}`
                    console.error("Failed to fetch data:", errorMessage)
                    setRowData([])
                    return
                }
                const data: AllTamaData = await response.json()
                const transformedData: TamaRow[] = Object.entries(data).map(([name, charData]) => {
                    const versionsArray = charData.versions || []
                    const partialTamaRow: Partial<TamaRow> = {
                        image: charData.image,
                        name: name,
                        link: charData.link,
                        gender: charData.gender,
                        versions: versionsArray
                    }
                    populateSpriteProperties(partialTamaRow, versionsArray, ALL_DEVICE_COLUMNS)
                    return partialTamaRow as TamaRow
                })
                setRowData(transformedData)
            } catch (err) {
                console.error("An unexpected error occurred while fetching data:", err)
                setRowData([])
            }
        }

        fetchData().then()
    }, [])

    return rowData
}
