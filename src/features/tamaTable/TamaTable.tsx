import {AgGridReact} from "ag-grid-react"
import * as React from "react"
import {useCallback, useEffect, useRef, useState} from "react"
import "../../global/AGGridTable.css"
import "./TamaTable.css"
import {DEVICE_FILTER_OPTIONS, GENDER_FILTER_OPTIONS, STAGE_FILTER_OPTIONS} from "../../global/constants.ts"
import type {TamaRow} from "../../global/types.ts"
import TamaFilters from "./filtering/TamaFilters.tsx"
import {useTamaFilters} from "./filtering/useTamaFilters.ts"
import {useTamaColumnDefs} from "./functions/useTamaColumnDefs.ts"
import {useTamaData} from "./functions/useTamaRowData.ts"
import {Cross1Icon} from "@radix-ui/react-icons"

export default function TamaTable({displayFilters, themeMode, isPhone}: {
    displayFilters: boolean,
    themeMode: string
    isPhone: boolean
}) {
    const {
        handleCheckboxChange,
        isFilterPresent,
        doesFilterPass,
        selectedDeviceOptions,
        selectedGenderOptions,
        selectedStageOptions
    } = useTamaFilters()

    const gridRef = useRef<AgGridReact<TamaRow>>(null)
    const columnDefs = useTamaColumnDefs(isPhone, selectedDeviceOptions)
    const rowData = useTamaData()
    const [searchText, setSearchText] = useState<string>("")

    const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value)
    }, [])

    const handleClearSearch = useCallback(() => {
        setSearchText("")
    }, [])

    useEffect(() => {
        if (gridRef.current?.api) {
            gridRef.current.api.onFilterChanged()
        }
    }, [selectedDeviceOptions, selectedGenderOptions, selectedStageOptions])

    return (
        <div className={"padding-css flex-column-1"}>
            {displayFilters &&
                <div style={{paddingBottom: "1em"}}>
                    <div className={"filter-grid"}>
                        <strong>Search:</strong>
                        <div className={"search-input-wrapper"}>
                            <input type="text" value={searchText} onChange={handleSearchChange}
                                   className={"search-field"}/>
                            {searchText && (
                                <button className={"clear-button"} onClick={handleClearSearch}>
                                    <Cross1Icon/>
                                </button>
                            )}
                        </div>
                        <TamaFilters
                            title="Devices"
                            options={DEVICE_FILTER_OPTIONS}
                            selectedOptions={selectedDeviceOptions}
                            onChange={e => handleCheckboxChange(e, "device")}
                        />
                        <TamaFilters
                            title="Gender"
                            options={GENDER_FILTER_OPTIONS}
                            selectedOptions={selectedGenderOptions}
                            onChange={e => handleCheckboxChange(e, "gender")}
                        />
                        <TamaFilters
                            title="Stages"
                            options={STAGE_FILTER_OPTIONS}
                            selectedOptions={selectedStageOptions}
                            onChange={e => handleCheckboxChange(e, "stages")}
                        />
                    </div>
                </div>
            }
            <div className={"flex-column-1"} data-ag-theme-mode={themeMode}>
                <div style={{flex: 1}}>
                    <AgGridReact<TamaRow>
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        isExternalFilterPresent={isFilterPresent}
                        doesExternalFilterPass={doesFilterPass}
                        quickFilterText={searchText}
                        gridOptions={{
                            enableCellTextSelection: true,
                            accentedSort: true,
                            columnHoverHighlight: true,
                            rowHeight: 52,
                            rowBuffer: 30
                        }}
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
