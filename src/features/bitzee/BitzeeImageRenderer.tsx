import type {ICellRendererParams} from "ag-grid-community"
import "../../global/Global.css"
import "../../global/AGGridTable.css"
import "./BitzeeTable.css"
import * as React from "react"
import useTooltip from "../../global/useTooltip.ts"
import ReactDOM from "react-dom"
import {getPortalRoot} from "../../global/functions.ts"

function BitzeeImageRenderer(params: ICellRendererParams) {
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

    const tooltipContent = params.data.name + " (" + params.data.rarity + ")"

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
                    className={"bitzee-image"}
                    src={import.meta.env.BASE_URL + "bitzee-sprites/" + params.value}
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

export default React.memo(BitzeeImageRenderer)
