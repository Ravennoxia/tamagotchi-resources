import type {ICellRendererParams} from "ag-grid-community"
import * as React from "react"
import {useMemo} from "react"
import ReactDOM from "react-dom"
import {type COLUMN_NAMES, DEVICE_NAMES} from "../../../global/constants.ts"
import type {VersionData} from "../../../global/types.ts"
import useTooltip from "../../../global/useTooltip.ts"
import "../../../global/AGGridTable.css"
import {getPortalRoot} from "../../../global/functions.ts"

export interface MyCellParams extends ICellRendererParams {
    deviceVersion?: keyof typeof COLUMN_NAMES
}

function TamaCellRenderer(params: MyCellParams) {
    const {
        showTooltip,
        tooltipPosition,
        targetRef,
        tooltipRef,
        handleMouseEnter,
        handleMouseLeave
    } = useTooltip({
        elementForListeners: params.eGridCell,
        horizontalCenter: false,
        gridDiv: params.eGridCell?.closest(".ag-root-wrapper")
    })

    const tooltipContent = useMemo(() => {
        if (!params.data?.versions || !params.deviceVersion) {
            return ""
        }
        const versionData = params.data.versions.find((v: VersionData) => v.version === params.deviceVersion)
        if (versionData?.devices) {
            const translatedDevices = versionData.devices.map((deviceKey: string) => {
                return (DEVICE_NAMES as Record<string, string>)[deviceKey] || deviceKey
            })
            return Array.from(new Set(translatedDevices)).join(", ")
        }
        return ""
    }, [params.data, params.deviceVersion])

    const portalRoot = getPortalRoot()

    return (
        <button
            ref={targetRef as React.Ref<HTMLButtonElement>}
            className={"cell-not-button"}
            style={{display: "flex"}}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {params.value && (
                <img
                    className={"tama-image-small"}
                    src={import.meta.env.BASE_URL + "tamagotchi-images/" + params.value}
                    alt={params.value}
                />
            )}
            {showTooltip && tooltipContent.length > 0 && portalRoot && ReactDOM.createPortal(
                <div
                    ref={tooltipRef}
                    className={"tooltip-css"}
                    style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left
                    }}
                >
                    {tooltipContent}
                </div>
                , portalRoot
            )}
        </button>
    )
}

export default React.memo(TamaCellRenderer)
