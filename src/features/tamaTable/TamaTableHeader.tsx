import type {IHeaderParams} from "ag-grid-community"
import useTooltip from "../useTooltip.ts"
import * as React from "react"
import {useMemo} from "react"
import ReactDOM from "react-dom"

interface MyHeaderParams extends IHeaderParams {
    tooltip?: string
}

export default function TamaTableHeader(params: MyHeaderParams) {
    const {
        showTooltip,
        tooltipPosition,
        targetRef,
        tooltipRef,
        handleMouseEnter,
        handleMouseLeave
    } = useTooltip({
        elementForListeners: params.eGridHeader,
        horizontalCenter: true
    })

    const headerTooltipContent = useMemo(() => {
        if (params.tooltip) {
            return params.tooltip
        }
    }, [params.tooltip])

    const portalRoot = document.getElementById("portal-root")
    if (!portalRoot) {
        console.error("portalRoot not found")
        return null
    }

    return (
        <button
            ref={targetRef as React.Ref<HTMLButtonElement>}
            className={"cell-not-button ag-header-cell-label"}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <span>{params.displayName}</span>
            {showTooltip && ReactDOM.createPortal(
                <div
                    ref={tooltipRef}
                    className={"tooltip-css"}
                    style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                        pointerEvents: "none",
                        position: "fixed"
                    }}
                >
                    {headerTooltipContent}
                </div>
                , portalRoot
            )}
        </button>
    )
}
