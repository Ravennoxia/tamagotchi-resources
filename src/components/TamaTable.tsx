import {type ColDef, type GridOptions, type IRowNode} from "ag-grid-community"
import {AgGridReact} from "ag-grid-react"
import ImageRenderer from "./renderers/ImageRenderer.tsx"
import {type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from "react"
import {
    type AllData,
    blackAndWhiteDevices,
    colorDevices,
    columnNames,
    deviceFilterOptions,
    deviceNames,
    genderFilterOptions,
    type IRow,
    stageFilterOptions,
    type VersionData
} from "../data/InterfacesAndConsts.tsx"
import CombinedRenderer from "./renderers/CombinedRenderer.tsx"

const PHONE_BREAKPOINT = 600

export default function TamaTable({displayFilters}: { displayFilters: boolean }) {
    const gridRef = useRef<AgGridReact<IRow>>(null)
    const [themeMode, setThemeMode] = useState<string>("dark")
    const [isPhone, setIsPhone] = useState<boolean>(window.innerWidth < PHONE_BREAKPOINT)
    const [selectedDeviceOptions, setSelectedDeviceOptions] = useState<string[]>(Object.values(deviceFilterOptions))
    const [selectedGenderOptions, setSelectedGenderOptions] = useState<string[]>(Object.values(genderFilterOptions))
    const [selectedStageOptions, setSelectedStageOptions] = useState<string[]>(Object.values(stageFilterOptions))
    const [rowData, setRowData] = useState<IRow[]>([])
    const columnDefs = useMemo<ColDef<IRow>[]>(() => {
        const staticColumn: ColDef<IRow> =
            {
                headerName: "Tamagotchi",
                field: "name",
                cellRenderer: CombinedRenderer,
                cellRendererParams: {
                    isPhone: isPhone
                },
                pinned: "left",
                unSortIcon: true,
                width: isPhone ? 150 : 200
            }
        let dynamicColumns: ColDef<IRow>[] = []
        if (selectedDeviceOptions.includes(deviceFilterOptions.blackAndWhite)) {
            dynamicColumns = [...dynamicColumns,
                getImageColumnDef("original", "spriteOriginal"),
                getImageColumnDef("osuMesu", "spriteOsuMesu"),
                getImageColumnDef("v1", "spriteV1"),
                getImageColumnDef("v2", "spriteV2"),
                getImageColumnDef("mini", "spriteMini"),
                getImageColumnDef("v3", "spriteV3"),
                getImageColumnDef("v4", "spriteV4"),
                getImageColumnDef("chu", "spriteChu"),
                getImageColumnDef("v5", "spriteV5"),
                getImageColumnDef("v6", "spriteV6"),
                getImageColumnDef("tamaGo", "spriteTamaGo"),
                getImageColumnDef("nano", "spriteNano"),
                getImageColumnDef("friends", "spriteFriends"),
                getImageColumnDef("pac-man", "spritePacMan"),
                getImageColumnDef("helloKitty", "spriteHelloKitty")
            ]
        }
        if (selectedDeviceOptions.includes(deviceFilterOptions.color)) {
            dynamicColumns = [...dynamicColumns,
                getImageColumnDef("plusColor", "spritePlusColor"),
                getImageColumnDef("iD", "spriteID"),
                getImageColumnDef("Ps", "spritePs"),
                getImageColumnDef("4U", "sprite4U"),
                getImageColumnDef("mix", "spriteMix"),
                getImageColumnDef("on", "spriteOn"),
                getImageColumnDef("pix", "spritePix"),
                getImageColumnDef("smart", "spriteSmart"),
                getImageColumnDef("uni", "spriteUni"),
                getImageColumnDef("paradise", "spriteParadise")
            ]
        }
        return [staticColumn, ...dynamicColumns]
    }, [isPhone, selectedDeviceOptions])

    const gridOptions: GridOptions<IRow> = {
        domLayout: "normal",
        enableCellTextSelection: true,
        ensureDomOrder: true,
        suppressColumnVirtualisation: true,
        accentedSort: true,
        enableBrowserTooltips: true,
        columnHoverHighlight: true
    }

    function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>, filterType: "device" | "gender" | "stages") {
        const {value, checked} = event.target
        if (filterType === "device") {
            setSelectedDeviceOptions(updateFilters(value, checked, selectedDeviceOptions))
        } else if (filterType === "gender") {
            setSelectedGenderOptions(updateFilters(value, checked, selectedGenderOptions))
        } else if (filterType === "stages") {
            setSelectedStageOptions(updateFilters(value, checked, selectedStageOptions))
        }
    }

    const isFilterPresent = useCallback((): boolean => {
        const deviceFilterActive =
            (selectedDeviceOptions.length > 0 &&
                selectedDeviceOptions.length < Object.keys(deviceFilterOptions).length) ||
            selectedDeviceOptions.length === 0
        const genderFilterActive =
            (selectedGenderOptions.length > 0 &&
                selectedGenderOptions.length < Object.keys(genderFilterOptions).length) ||
            selectedGenderOptions.length === 0
        const stageFilterActive =
            (selectedStageOptions.length > 0 &&
                selectedStageOptions.length < Object.keys(stageFilterOptions).length) ||
            selectedStageOptions.length === 0
        return deviceFilterActive || genderFilterActive || stageFilterActive
    }, [selectedDeviceOptions, selectedGenderOptions, selectedStageOptions])

    const passesDeviceFilter = useCallback((versions: VersionData[] | undefined) => {
        if (!versions || versions.length === 0) {
            return false
        }
        if (selectedDeviceOptions.length === Object.keys(deviceFilterOptions).length) {
            return true
        }
        const devices = versions.map(v => v.version)
        if (selectedDeviceOptions.length > 0 && selectedDeviceOptions.length < Object.keys(deviceFilterOptions).length) {
            const includesBlackAndWhite = selectedDeviceOptions.includes(deviceFilterOptions.blackAndWhite) && devices.some(d => blackAndWhiteDevices.includes(d))
            const includesColor = selectedDeviceOptions.includes(deviceFilterOptions.color) && devices.some(d => colorDevices.includes(d))
            return includesBlackAndWhite || includesColor
        }
        return false
    }, [selectedDeviceOptions])

    const passesGenderFilter = useCallback((versions: VersionData[] | undefined) => {
        if (!versions || versions.length === 0) {
            return false
        }
        if (selectedGenderOptions.length === Object.keys(genderFilterOptions).length) {
            return true
        }
        const genders = Array.from(new Set(versions.map(v => v.gender)))
        if (selectedGenderOptions.length > 0 && selectedGenderOptions.length < Object.keys(genderFilterOptions).length) {
            return genders.some(g => selectedGenderOptions.includes(g))
        }
        return false
    }, [selectedGenderOptions])

    const passesStageFilter = useCallback((versions: VersionData[] | undefined) => {
        if (!versions || versions.length === 0) {
            return false
        }
        if (selectedStageOptions.length === Object.keys(stageFilterOptions).length) {
            return true
        }
        const stages = Array.from(new Set(versions.map(v => v.stage)))
        if (selectedStageOptions.length > 0 && selectedStageOptions.length < Object.keys(stageFilterOptions).length) {
            return stages.some(s => selectedStageOptions.includes(s))
        }
        return false
    }, [selectedStageOptions])

    const doesFilterPass = useCallback((node: IRowNode<IRow>): boolean => {
        const {versions} = node.data || {}
        return passesDeviceFilter(versions) && passesGenderFilter(versions) && passesStageFilter(versions)
    }, [passesDeviceFilter, passesGenderFilter, passesStageFilter])

    const handleResize = useCallback(() => {
        const newIsPhone = window.innerWidth < PHONE_BREAKPOINT
        if (newIsPhone !== isPhone) {
            setIsPhone(newIsPhone)
        }
    }, [isPhone])

    useEffect(() => {
        if (gridRef.current?.api) {
            gridRef.current.api.onFilterChanged()
        }
    }, [columnDefs, selectedGenderOptions, selectedStageOptions])

    useEffect(() => {
        window.matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", event => {
                setThemeMode(event.matches ? "dark" : "light")
            })

        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [handleResize])

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
                        versions: charData.versions,
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
        <div className={"padding flex-column-1"}>
            {displayFilters &&
                <div>
                    <div className={"filter-grid"}>
                        <strong> Devices:</strong>
                        <div className={"filter-row"}>
                            {Object.entries(deviceFilterOptions).map(([key, value]) => (
                                <label key={key}>
                                    <input type="checkbox" value={value} checked={selectedDeviceOptions.includes(value)}
                                           onChange={e => handleCheckboxChange(e, "device")}/>
                                    {value}
                                </label>
                            ))}
                        </div>
                        <strong>Gender:</strong>
                        <div className={"filter-row"}>
                            {Object.entries(genderFilterOptions).map(([key, value]) => (
                                <label key={key}>
                                    <input type="checkbox" value={value} checked={selectedGenderOptions.includes(value)}
                                           onChange={e => handleCheckboxChange(e, "gender")}/>
                                    {value}
                                </label>
                            ))}
                        </div>
                        <strong>Stages:</strong>
                        <div className={"filter-row"}>
                            {Object.entries(stageFilterOptions).map(([key, value]) => (
                                <label key={key}>
                                    <input type="checkbox" value={value} checked={selectedStageOptions.includes(value)}
                                           onChange={e => handleCheckboxChange(e, "stages")}/>
                                    {value}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            }
            <div className={"flex-column-1"} data-ag-theme-mode={themeMode}>
                <div style={{flex: 1}}>
                    <AgGridReact<IRow>
                        rowData={rowData}
                        columnDefs={columnDefs}
                        gridOptions={gridOptions}
                        isExternalFilterPresent={isFilterPresent}
                        doesExternalFilterPass={doesFilterPass}
                    />
                </div>
                {isPhone &&
                    <strong style={{textAlign: "right"}}>This site is best viewed in landscape mode</strong>
                }
                <cite style={{textAlign: "right"}}>Images and information are from the <a
                    href={"https://tamagotchi.fandom.com/wiki/Main_Page"} target="_blank" rel="noopener noreferrer">Tamagotchi
                    Wiki</a></cite>
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

function getImageColumnDef(version: keyof typeof columnNames, field: keyof IRow): ColDef<IRow> {
    const [shortName, longName] = columnNames[version] ?? ["", ""]
    return {
        headerName: shortName,
        field: field,
        headerTooltip: longName,
        tooltipValueGetter: (params) => {
            if (!params.data?.versions || !version) {
                return ""
            }
            const versionData = params.data.versions.find(v => v.version === version)
            if (versionData?.devices) {
                const translatedDevices = versionData.devices.map(deviceKey => {
                    return (deviceNames as Record<string, string>)[deviceKey] || deviceKey
                })
                return Array.from(new Set(translatedDevices)).join(", ")
            }
            return ""
        },
        filter: false,
        sortable: false,
        cellRenderer: ImageRenderer,
        autoHeight: true,
        width: 52
    }
}

function updateFilters(value: string, checked: boolean, prevFilters: string[]) {
    if (checked) {
        return [...prevFilters, value]
    }
    return prevFilters.filter(filter => filter !== value)
}
