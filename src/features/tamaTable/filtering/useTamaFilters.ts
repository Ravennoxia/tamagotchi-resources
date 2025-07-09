import {type ChangeEvent, useCallback, useState} from "react"
import {
    BLACK_AND_WHITE_DEVICES,
    COLOR_DEVICES,
    DEVICE_FILTER_OPTIONS,
    GENDER_FILTER_OPTIONS,
    STAGE_FILTER_OPTIONS
} from "../../../global/constants.ts"
import {checkFilterPasses, isNoneSelected, isPartialSelection, updateFilters} from "../functions/tamaTableFunctions.ts"
import type {TamaRow, VersionData} from "../../../global/types.ts"
import type {IRowNode} from "ag-grid-community"

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
        device: Object.values(DEVICE_FILTER_OPTIONS),
        gender: Object.values(GENDER_FILTER_OPTIONS),
        stages: Object.values(STAGE_FILTER_OPTIONS)
    })

    const handleCheckboxChange = useCallback((event: ChangeEvent<HTMLInputElement>, filterType: "device" | "gender" | "stages") => {
        const {value, checked} = event.target
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterType]: updateFilters(value, checked, prevFilters[filterType])
        }))
    }, [])

    const isFilterPresent = useCallback((): boolean => {
        return isPartialSelection(filters.device, DEVICE_FILTER_OPTIONS) || isNoneSelected(filters.device) ||
            isPartialSelection(filters.gender, GENDER_FILTER_OPTIONS) || isNoneSelected(filters.gender) ||
            isPartialSelection(filters.stages, STAGE_FILTER_OPTIONS) || isNoneSelected(filters.stages)
    }, [filters])

    const deviceSpecificLogic = useCallback((selectedFilters: string[], actualDeviceVersions: string[]): boolean => {
        const includesBlackAndWhiteSelected = selectedFilters.includes(DEVICE_FILTER_OPTIONS.blackAndWhite)
        const includesColorSelected = selectedFilters.includes(DEVICE_FILTER_OPTIONS.color)
        const hasBlackAndWhiteDevice = actualDeviceVersions.some(d => BLACK_AND_WHITE_DEVICES.includes(d))
        const hasColorDevice = actualDeviceVersions.some(d => COLOR_DEVICES.includes(d))
        return (includesBlackAndWhiteSelected && hasBlackAndWhiteDevice) ||
            (includesColorSelected && hasColorDevice)
    }, [])

    const passesDeviceFilter = useCallback((versions: VersionData[]) => {
        return checkFilterPasses(
            versions,
            filters.device,
            DEVICE_FILTER_OPTIONS,
            (v) => v.version,
            deviceSpecificLogic
        )
    }, [filters.device, deviceSpecificLogic])

    const passesGenderFilter = useCallback((versions: VersionData[]) => {
        return checkFilterPasses(
            versions,
            filters.gender,
            GENDER_FILTER_OPTIONS,
            (v) => v.gender
        )
    }, [filters.gender])

    const passesStageFilter = useCallback((versions: VersionData[]) => {
        const hasDefinedStage = versions.some(v => v.stage !== undefined && v.stage !== null && v.stage !== "")
        const hasMissingStageData = versions.length > 0 && !hasDefinedStage
        if (hasMissingStageData) {
            return true
        }
        return checkFilterPasses(
            versions,
            filters.stages,
            STAGE_FILTER_OPTIONS,
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
