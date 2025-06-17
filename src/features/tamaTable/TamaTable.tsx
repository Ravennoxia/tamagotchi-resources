import {AgGridReact} from "ag-grid-react"
import {useEffect, useRef} from "react"
import "../../global/AGGridTable.css"
import "./TamaTable.css"
import {DEVICE_FILTER_OPTIONS, GENDER_FILTER_OPTIONS, STAGE_FILTER_OPTIONS} from "../../global/constants.ts"
import type {TamaRow} from "../../global/types.ts"
import TamaFilters from "./filtering/TamaFilters.tsx"
import {useTamaFilters} from "./filtering/useTamaFilters.ts"
import {useTamaColumnDefs} from "./useTamaColumnDefs.ts"
import {useTamaData} from "./useTamaRowData.ts"

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
                        rowData={rowData}
                        columnDefs={columnDefs}
                        isExternalFilterPresent={isFilterPresent}
                        doesExternalFilterPass={doesFilterPass}
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
