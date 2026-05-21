import type {ICellRendererParams} from "ag-grid-community"
import "../../../global/Global.css"
import "../../../global/AGGridTable.css"
import "../DigimonTable.css"
import * as React from "react"
import useTooltip from "../../../global/useTooltip.ts"
import ReactDOM from "react-dom"
import {getPortalRoot} from "../../../global/functions.ts"

interface DigiImageRendererParams extends ICellRendererParams {
    deviceVersion: string
    image: number
}


function DigimonImageRenderer(params: DigiImageRendererParams) {
    const {
        showTooltip,
        tooltipPosition,
        targetRef,
        tooltipRef,
        handleMouseEnter,
        handleMouseLeave
    } = useTooltip({
        elementForListeners: params.eGridCell,
        horizontalCenter: true,
        gridDiv: params.eGridCell?.closest(".ag-root-wrapper")
    })
    const version = params.data.versions.find((v: { device: string }) => v.device === params.deviceVersion)
    const tooltipContent = version?.devices.join(", ") || ""
    const spriteName = version?.sprites[params.image] || ""
    const portalRoot = getPortalRoot()
    const displayTooltip = showTooltip && tooltipContent.length > 0

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
                    className={"digi_sprite"}
                    src={import.meta.env.BASE_URL + "digimon-images/" + spriteName}
                    alt={params.data.name}
                />
            )}
            {portalRoot && ReactDOM.createPortal(
                <div
                    ref={tooltipRef}
                    className={"tooltip-css"}
                    style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                        whiteSpace: "nowrap",
                        visibility: displayTooltip ? "visible" : "hidden",
                        opacity: displayTooltip ? 1 : 0,
                        pointerEvents: displayTooltip ? "auto" : "none"
                    }}
                >
                    {tooltipContent}
                </div>
                , portalRoot
            )}
        </button>
    )
}

export default React.memo(DigimonImageRenderer)
