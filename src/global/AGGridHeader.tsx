import type {IHeaderParams} from "ag-grid-community"
import useTooltip from "./useTooltip.ts"
import * as React from "react"
import {useMemo} from "react"
import ReactDOM from "react-dom"
import {getPortalRoot} from "./functions.ts"

interface MyHeaderParams extends IHeaderParams {
    tooltip?: string,
    useEllipsis: boolean
}

export default function AGGridHeader(params: MyHeaderParams) {
    const {
        showTooltip,
        tooltipPosition,
        targetRef,
        tooltipRef,
        handleMouseEnter,
        handleMouseLeave
    } = useTooltip({
        elementForListeners: params.eGridHeader,
        horizontalCenter: true,
        gridDiv: params.eGridHeader?.closest(".ag-root-wrapper"),
        isHeader: true
    })

    const headerTextStyle = useMemo(() => {
        const baseStyle = {
            overflow: "hidden"
        }
        if (params.useEllipsis) {
            return {...baseStyle, textOverflow: "ellipsis", whiteSpace: "nowrap"}
        }
        return baseStyle
    }, [params.useEllipsis])

    const headerTooltipContent = useMemo(() => {
        if (params.tooltip) {
            return params.tooltip
        }
        return params.displayName
    }, [params.displayName, params.tooltip])

    const portalRoot = getPortalRoot()

    return (
        <button
            ref={targetRef as React.Ref<HTMLButtonElement>}
            className={"cell-not-button header-css"}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={headerTextStyle}
        >
            <span style={headerTextStyle}>{params.displayName}</span>
            {showTooltip && portalRoot && ReactDOM.createPortal(
                <div
                    ref={tooltipRef}
                    className={"tooltip-css"}
                    style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left
                    }}
                >
                    {headerTooltipContent}
                </div>
                , portalRoot
            )}
        </button>
    )
}
