import type {ICellRendererParams} from "ag-grid-community"
import "../../../global/AGGridTable.css"
import "../DigimonTable.css"
import * as React from "react"
import useTooltip from "../../../global/useTooltip.ts"
import {getPortalRoot} from "../../../global/functions.ts"
import {createPortal} from "react-dom"
import type {DigiRow} from "../digiConstantsAndTypes.ts"

interface DigiNameRendererParams extends ICellRendererParams<DigiRow, string | null> {
    themeMode: string;
    isPhone: boolean;
}

function DigimonNameRenderer(params: DigiNameRendererParams) {
    const image = params.data?.image
    const imageUrl = image ? import.meta.env.BASE_URL + "digimon-images/" + image : null

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
    const displayTooltip = showTooltip && imageUrl !== null

    return (
        <p
            style={{
                display: "flex",
                alignItems: "center"
            }}
        >
            {imageUrl && (
                <button
                    ref={targetRef as React.RefObject<HTMLButtonElement> | null}
                    className={"cell-not-button"}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <img
                        src={imageUrl}
                        alt={params.data?.name}
                        className={"digi_image"}
                    />
                    {portalRoot && createPortal(
                        <div
                            ref={tooltipRef}
                            style={{
                                position: "absolute",
                                top: tooltipPosition.top - 76,
                                left: tooltipPosition.left + 73,
                                visibility: displayTooltip ? "visible" : "hidden",
                                opacity: displayTooltip ? 1 : 0,
                                pointerEvents: displayTooltip ? "auto" : "none"
                            }}
                        >
                            <img
                                src={imageUrl}
                                alt={params.data?.name}
                                style={{
                                    width: "200px",
                                    height: "200px",
                                    borderRadius: "1rem",
                                    border: "1px solid",
                                    borderColor: `var(${params.themeMode === "light" ? "--light-border" : "--dark-border"})`
                                }}
                            />
                        </div>
                        , portalRoot
                    )}
                </button>
            )}
            <span style={{textAlign: "left"}}>
                {params.value}
            </span>
        </p>
    )
}

export default React.memo(DigimonNameRenderer)
