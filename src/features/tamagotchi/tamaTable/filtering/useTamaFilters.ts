import {type ChangeEvent, useCallback, useState} from "react"
import {checkFilterPasses, isNoneSelected, isPartialSelection, updateFilters} from "../functions/tamaTableFunctions.ts"
import type {IRowNode} from "ag-grid-community"
import type {TamaRow, TamaVersionData} from "../../tamaTypes.ts"
import {
    TAMA_BLACK_AND_WHITE_DEVICES,
    TAMA_COLOR_DEVICES,
    TAMA_DEVICE_FILTER_OPTIONS,
    TAMA_GENDER_FILTER_OPTIONS,
    TAMA_STAGE_FILTER_OPTIONS
} from "../../tamaConstants.ts"

interface TamaFiltersReturn {
    handleCheckboxChange: (event: ChangeEvent<HTMLInputElement>, filterType: "device" | "gender" | "stages") => void;
    isFilterPresent: () => boolean;
    doesFilterPass: (node: IRowNode<TamaRow>) => boolean;
    selectedDeviceOptions: string[];
    selectedGenderOptions: string[];
    selectedStageOptions: string[];
}

export function useTamaFilters(): TamaFiltersReturn {
    const [filters, setFilters] = useState({
        device: Object.values(TAMA_DEVICE_FILTER_OPTIONS),
        gender: Object.values(TAMA_GENDER_FILTER_OPTIONS),
        stages: Object.values(TAMA_STAGE_FILTER_OPTIONS)
    })

    const handleCheckboxChange = useCallback((event: ChangeEvent<HTMLInputElement>, filterType: "device" | "gender" | "stages") => {
        const {value, checked} = event.target
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterType]: updateFilters(value, checked, prevFilters[filterType])
        }))
    }, [])

    const isFilterPresent = useCallback((): boolean => {
        return isPartialSelection(filters.device, TAMA_DEVICE_FILTER_OPTIONS) || isNoneSelected(filters.device) ||
            isPartialSelection(filters.gender, TAMA_GENDER_FILTER_OPTIONS) || isNoneSelected(filters.gender) ||
            isPartialSelection(filters.stages, TAMA_STAGE_FILTER_OPTIONS) || isNoneSelected(filters.stages)
    }, [filters])

    const deviceSpecificLogic = useCallback((selectedFilters: string[], actualDeviceVersions: string[]): boolean => {
        const includesBlackAndWhiteSelected = selectedFilters.includes(TAMA_DEVICE_FILTER_OPTIONS.blackAndWhite)
        const includesColorSelected = selectedFilters.includes(TAMA_DEVICE_FILTER_OPTIONS.color)
        const hasBlackAndWhiteDevice = actualDeviceVersions.some(d => TAMA_BLACK_AND_WHITE_DEVICES.includes(d))
        const hasColorDevice = actualDeviceVersions.some(d => TAMA_COLOR_DEVICES.includes(d))
        return (includesBlackAndWhiteSelected && hasBlackAndWhiteDevice) ||
            (includesColorSelected && hasColorDevice)
    }, [])

    const passesDeviceFilter = useCallback((versions: TamaVersionData[]) => {
        return checkFilterPasses(
            versions,
            filters.device,
            TAMA_DEVICE_FILTER_OPTIONS,
            (v) => v.version,
            deviceSpecificLogic
        )
    }, [filters.device, deviceSpecificLogic])

    const passesGenderFilter = useCallback((versions: TamaVersionData[]) => {
        return checkFilterPasses(
            versions,
            filters.gender,
            TAMA_GENDER_FILTER_OPTIONS,
            (v) => v.gender
        )
    }, [filters.gender])

    const passesStageFilter = useCallback((versions: TamaVersionData[]) => {
        const hasDefinedStage = versions.some(v => v.stage !== undefined && v.stage !== null && v.stage !== "")
        const hasMissingStageData = versions.length > 0 && !hasDefinedStage
        if (hasMissingStageData) {
            return true
        }
        return checkFilterPasses(
            versions,
            filters.stages,
            TAMA_STAGE_FILTER_OPTIONS,
            (v) => v.stage
        )
    }, [filters.stages])

    const doesFilterPass = useCallback((node: IRowNode<TamaRow>): boolean => {
        if (!node.data) {
            return false
        }
        const versions = node.data.versions
        return passesDeviceFilter(versions) && passesGenderFilter(versions) && passesStageFilter(versions)
    }, [passesDeviceFilter, passesGenderFilter, passesStageFilter])

    return {
        handleCheckboxChange,
        isFilterPresent,
        doesFilterPass,
        selectedDeviceOptions: filters.device,
        selectedGenderOptions: filters.gender,
        selectedStageOptions: filters.stages
    }
}
