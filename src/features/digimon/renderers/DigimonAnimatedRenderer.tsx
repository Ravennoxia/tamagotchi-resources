import type {ICellRendererParams} from "ag-grid-community"
import "../../../global/Global.css"
import "../../../global/AGGridTable.css"
import "../DigimonTable.css"
import * as React from "react"
import {useState} from "react"
import useTooltip from "../../../global/useTooltip.ts"
import ReactDOM from "react-dom"
import {getPortalRoot} from "../../../global/functions.ts"

interface DigiAnimatedRendererParams extends ICellRendererParams {
    animationsPaused: boolean
    deviceVersion: string
}

function DigimonAnimatedRenderer(params: DigiAnimatedRendererParams) {
    const [imageIndex, setImageIndex] = useState(0)
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
    const images = version?.sprites ?? []
    const currentImage = params.animationsPaused ? images[1] : images[imageIndex]

    React.useEffect(() => {
        if (images.length > 1 && !params.animationsPaused) {
            const interval = setInterval(() => {
                setImageIndex(prev => (prev + 1) % images.length)
            }, 500)
            return () => clearInterval(interval)
        }
    }, [images.length, params.animationsPaused])


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
            {currentImage && (
                <img
                    className={"digi_sprite"}
                    src={import.meta.env.BASE_URL + "digimon-images/" + currentImage}
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

export default React.memo(DigimonAnimatedRenderer)
