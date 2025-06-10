import type {ICellRendererParams} from "ag-grid-community"
import * as React from "react"
import {useMemo} from "react"
import ReactDOM from "react-dom"
import "./ImageRendererWithTooltip.css"
import {type columnNames, deviceNames} from "../../../global/constants.ts"
import type {VersionData} from "../../../global/types.ts"
import useTooltip from "../tooltip.ts"

export interface MyCellParams extends ICellRendererParams {
    deviceVersion?: keyof typeof columnNames
}

function ImageRendererWithTooltip(params: MyCellParams) {
    const {
        showTooltip,
        tooltipPosition,
        targetRef,
        tooltipRef,
        handleMouseEnter,
        handleMouseLeave
    } = useTooltip({
        elementForListeners: params.eGridCell
    })

    const tooltipContent = useMemo(() => {
        if (!params.data?.versions || !params.deviceVersion) {
            return ""
        }
        const versionData = params.data.versions.find((v: VersionData) => v.version === params.deviceVersion)
        if (versionData?.devices) {
            const translatedDevices = versionData.devices.map((deviceKey: string) => {
                return (deviceNames as Record<string, string>)[deviceKey] || deviceKey
            })
            return Array.from(new Set(translatedDevices)).join(", ")
        }
        return ""
    }, [params.data, params.deviceVersion])

    const portalRoot = document.getElementById("portal-root")
    if (!portalRoot) {
        console.error("portalRoot not found")
        return null
    }

    return (
        <button
            ref={targetRef as React.Ref<HTMLButtonElement>}
            className={"tama-image-span cell-not-button"}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {params.value && (
                <img
                    className={"tama-image-small"}
                    src={"/tamagotchi-images/" + params.value}
                    alt={params.value}
                />
            )}
            {showTooltip && tooltipContent.length > 0 && ReactDOM.createPortal(
                <div
                    ref={tooltipRef}
                    className={"tooltip-css"}
                    style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                        pointerEvents: "auto"
                    }}
                >
                    {tooltipContent}
                </div>
                , portalRoot
            )}
        </button>
    )
}

export default React.memo(ImageRendererWithTooltip)
