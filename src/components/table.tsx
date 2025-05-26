import {type ColDef, type GridOptions, type IRowNode} from "ag-grid-community"
import {AgGridReact} from "ag-grid-react"
import ImageRenderer from "./renderers/imageRenderer.tsx"
import {type ChangeEvent, useCallback, useEffect, useRef, useState} from "react"
import NameRenderer from "./renderers/nameRenderer.tsx"

interface AllData {
    [characterName: string]: TamaData
}

interface TamaData {
    link: string
    image: string
    gender: string
    versions: VersionData[]
}

interface VersionData {
    version: string
    stage: string
    gender: string | null
    sprite: string
}

export interface IRow {
    image: string
    name: string
    link: string
    gender: string | null
    spriteOriginal: string | null
    spriteOsuMesu: string | null
    spriteV1: string | null
    spriteV2: string | null
    spriteMini: string | null
    spriteV3: string | null
    spriteV4: string | null
    spriteChu: string | null
    spriteV5: string | null
    spriteV6: string | null
    spriteTamaGo: string | null
    spriteNano: string | null
    spriteFriends: string | null
    spritePacMan: string | null
    spriteHelloKitty: string | null
    spritePlusColor: string | null
    spriteID: string | null
    spritePs: string | null
    sprite4U: string | null
    spriteMix: string | null
    spriteOn: string | null
    spritePix: string | null
    spriteSmart: string | null
    spriteUni: string | null
    spriteParadise: string | null
}

const genderFilterOptions = ["Female", "Male", "Other"]

export default function TamaTable({displayFilters}: { displayFilters: boolean }) {
    const gridRef = useRef<AgGridReact<TamaData>>(null)
    const [themeMode, setThemeMode] = useState<string>("dark")
    const [selectedGenderOptions, setSelectedGenderOptions] = useState<string[]>(["Female", "Male", "Other"])
    const [rowData, setRowData] = useState<IRow[]>([])
    const [columnDefs] = useState<ColDef<IRow>[]>([
        {
            headerName: "",
            field: "image",
            filter: false,
            sortable: false,
            cellRenderer: ImageRenderer,
            autoHeight: true,
            pinned: "left"
        },
        {
            headerName: "Tamagotchi",
            field: "name",
            cellRenderer: NameRenderer,
            cellClass: "tama-name",
            pinned: "left",
            unSortIcon: true
        },
        getImageColumnDef("Original", "spriteOriginal"),
        getImageColumnDef("Osutchi & Mesutchi", "spriteOsuMesu"),
        getImageColumnDef("v1", "spriteV1"),
        getImageColumnDef("v2", "spriteV2"),
        getImageColumnDef("Mini", "spriteMini"),
        getImageColumnDef("v3", "spriteV3"),
        getImageColumnDef("v4", "spriteV4"),
        getImageColumnDef("Chu", "spriteChu"),
        getImageColumnDef("v5", "spriteV5"),
        getImageColumnDef("v6", "spriteV6"),
        getImageColumnDef("TamaGo", "spriteTamaGo"),
        getImageColumnDef("Nano", "spriteNano"),
        getImageColumnDef("Friends", "spriteFriends"),
        getImageColumnDef("Pac-Man", "spritePacMan"),
        getImageColumnDef("Hello Kitty", "spriteHelloKitty"),
        getImageColumnDef("+C", "spritePlusColor"),
        getImageColumnDef("iD", "spriteID"),
        getImageColumnDef("P's", "spritePs"),
        getImageColumnDef("4U", "sprite4U"),
        getImageColumnDef("M!x", "spriteMix"),
        getImageColumnDef("On", "spriteOn"),
        getImageColumnDef("Pix", "spritePix"),
        getImageColumnDef("Smart", "spriteSmart"),
        getImageColumnDef("Uni", "spriteUni"),
        getImageColumnDef("Paradise", "spriteParadise")

    ])

    const gridOptions: GridOptions<IRow> = {
        domLayout: "normal",
        autoSizeStrategy: {type: "fitCellContents", skipHeader: true},
        enableCellTextSelection: true,
        ensureDomOrder: true,
        suppressColumnVirtualisation: true,
        accentedSort: true
    }

    function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>) {
        const {value, checked} = event.target
        setSelectedGenderOptions(prevFilters => {
            if (checked) {
                return [...prevFilters, value]
            }
            return prevFilters.filter(filter => filter !== value)
        })
    }

    const isFilterPresent = useCallback((): boolean => {
        return true
    }, [])

    const doesFilterPass = useCallback((node: IRowNode<IRow>): boolean => {
        const gender = node.data?.gender
        if (!gender || selectedGenderOptions.length === 0) {
            return false
        }
        for (const filter of selectedGenderOptions) {
            if (gender === filter) {
                return true
            }
        }
        return false
    }, [selectedGenderOptions])

    useEffect(() => {
        if (gridRef.current?.api) {
            gridRef.current.api.onFilterChanged()
        }
    }, [selectedGenderOptions])

    useEffect(() => {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => {
            setThemeMode(event.matches ? "dark" : "light")
        })
    }, [])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(import.meta.env.BASE_URL + "tamagotchi-data.json")
                if (!response.ok) {
                    // noinspection ExceptionCaughtLocallyJS
                    throw new Error(response.status.toString())
                }
                const data: AllData = await response.json()
                const transformedData: IRow[] = Object.entries(data).map(([name, charData]) => {
                    return {
                        image: charData.image,
                        name: name,
                        link: charData.link,
                        gender: charData.gender,
                        spriteOriginal: getVersionSprite(charData.versions, "original"),
                        spriteOsuMesu: getVersionSprite(charData.versions, "osuMesu"),
                        spriteV1: getVersionSprite(charData.versions, "v1"),
                        spriteV2: getVersionSprite(charData.versions, "v2"),
                        spriteMini: getVersionSprite(charData.versions, "mini"),
                        spriteV3: getVersionSprite(charData.versions, "v3"),
                        spriteV4: getVersionSprite(charData.versions, "v4"),
                        spriteChu: getVersionSprite(charData.versions, "chu"),
                        spriteV5: getVersionSprite(charData.versions, "v5"),
                        spriteV6: getVersionSprite(charData.versions, "v6"),
                        spriteTamaGo: getVersionSprite(charData.versions, "tamaGo"),
                        spriteNano: getVersionSprite(charData.versions, "nano"),
                        spriteFriends: getVersionSprite(charData.versions, "friends"),
                        spritePacMan: getVersionSprite(charData.versions, "pac-man"),
                        spriteHelloKitty: getVersionSprite(charData.versions, "helloKitty"),
                        spritePlusColor: getVersionSprite(charData.versions, "plusColor"),
                        spriteID: getVersionSprite(charData.versions, "iD"),
                        spritePs: getVersionSprite(charData.versions, "Ps"),
                        sprite4U: getVersionSprite(charData.versions, "4U"),
                        spriteMix: getVersionSprite(charData.versions, "mix"),
                        spriteOn: getVersionSprite(charData.versions, "on"),
                        spritePix: getVersionSprite(charData.versions, "pix"),
                        spriteSmart: getVersionSprite(charData.versions, "smart"),
                        spriteUni: getVersionSprite(charData.versions, "uni"),
                        spriteParadise: getVersionSprite(charData.versions, "paradise")
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
        <div style={{display: "flex", flexDirection: "column", flex: 1}} className={"padding"}>
            {displayFilters &&
                <div style={{display: "flex", textAlign: "left", gap: "1em"}}>
                    <strong>Gender:</strong>
                    {genderFilterOptions.map(option => (
                        <label key={option}>
                            <input type="checkbox" value={option} checked={selectedGenderOptions.includes(option)}
                                   onChange={handleCheckboxChange}/>
                            {option}
                        </label>
                    ))}
                </div>
            }
            <div style={{flex: 1}} data-ag-theme-mode={themeMode}>
                <AgGridReact<IRow>
                    rowData={rowData}
                    columnDefs={columnDefs}
                    gridOptions={gridOptions}
                    isExternalFilterPresent={isFilterPresent}
                    doesExternalFilterPass={doesFilterPass}
                />
            </div>
        </div>
    )
}

function getVersionSprite(versions: VersionData[], name: string): string | null {
    const v = versions.find((v) => v.version === name)
    if (v) {
        return v.sprite
    }
    return null
}

function getImageColumnDef(headerName: string, field: keyof IRow): ColDef<IRow> {
    const props: ColDef<IRow> = {
        filter: false,
        sortable: false,
        cellRenderer: ImageRenderer
    }
    return {
        headerName,
        field,
        ...props
    }
}
