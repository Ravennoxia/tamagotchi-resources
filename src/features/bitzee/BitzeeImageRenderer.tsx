import type {ICellRendererParams} from "ag-grid-community"
import "../../global/AGGridTable.css"
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
                    className={"bitzee-image"}
                    src={import.meta.env.BASE_URL + "bitzee-sprites/" + params.value}
                    alt={params.data.name}
                />
            )}
            {showTooltip && portalRoot && ReactDOM.createPortal(
                <div
                    ref={tooltipRef}
                    className={"tooltip-css"}
                    style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                        whiteSpace: "nowrap"
                    }}
                >
                    {params.data.name + " (" + params.data.rarity + ")"}
                </div>
                , portalRoot
            )}
        </button>
    )
}

export default React.memo(BitzeeImageRenderer)
