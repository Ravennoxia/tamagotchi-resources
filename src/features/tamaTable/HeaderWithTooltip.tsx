import type {IHeaderParams} from "ag-grid-community"
import useTooltip from "./tooltip.ts"
import * as React from "react"
import {useMemo} from "react"
import ReactDOM from "react-dom"

interface MyHeaderParams extends IHeaderParams {
    tooltip?: string
}

export default function HeaderWithTooltip(params: MyHeaderParams) {
    const {
        showTooltip,
        tooltipPosition,
        targetRef,
        tooltipRef,
        handleMouseEnter,
        handleMouseLeave
    } = useTooltip({
        elementForListeners: params.eGridHeader
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
            <span className={"ag-header-cell-text"}>{params.displayName}</span>
            {showTooltip && ReactDOM.createPortal(
                <div
                    ref={tooltipRef}
                    className={"tooltip-css"}
                    style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                        pointerEvents: "none"
                    }}
                >
                    {headerTooltipContent}
                </div>
                , portalRoot
            )}
        </button>
    )
}
