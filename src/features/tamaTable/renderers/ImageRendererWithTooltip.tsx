import type {ICellRendererParams} from "ag-grid-community"
import * as React from "react"
import {useCallback, useEffect, useMemo, useRef, useState} from "react"
import ReactDOM from "react-dom"
import "./ImageRendererWithTooltip.css"
import {type columnNames, deviceNames} from "../../../global/constants.ts"
import type {VersionData} from "../../../global/types.ts"

export interface MyCellParams extends ICellRendererParams {
    deviceVersion?: keyof typeof columnNames
}

export default function ImageRendererWithTooltip(params: MyCellParams) {
    const [showTooltip, setShowTooltip] = useState(false)
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number, left: number }>({top: 0, left: 0})
    const cellRef = useRef<HTMLButtonElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const touchMoveRef = useRef(false)
    const ignoreTooltipCloseRef = useRef(false)
    const currentShowTooltipRef = useRef(showTooltip)
    const isDraggingRef = useRef(false)
    const dragEndTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        currentShowTooltipRef.current = showTooltip
    }, [showTooltip])

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

    useEffect(() => {
        const handleTooltipClose = (event: TouchEvent) => {
            if (ignoreTooltipCloseRef.current) {
                ignoreTooltipCloseRef.current = false
                return
            }
            const insideCellButton = cellRef.current?.contains(event.target as Node)
            const insideTooltip = tooltipRef.current?.contains(event.target as Node)

            if (showTooltip && !insideCellButton && !insideTooltip) {
                setShowTooltip(false)
            }
        }

        if (showTooltip) {
            document.addEventListener("touchend", handleTooltipClose)
        } else {
            document.removeEventListener("touchend", handleTooltipClose)
        }

        return () => {
            document.removeEventListener("touchend", handleTooltipClose)
        }
    }, [showTooltip])

    function handleMouseEnter(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation()
        if (cellRef.current) {
            const rect = cellRef.current.getBoundingClientRect()
            setTooltipPosition({top: rect.bottom, left: rect.left})
        }
        setShowTooltip(true)
    }

    function handleMouseLeave() {
        setShowTooltip(false)
    }

    const handleTouchStart = useCallback(() => {
        touchMoveRef.current = false
        ignoreTooltipCloseRef.current = false
        if (dragEndTimeoutIdRef.current) {
            clearTimeout(dragEndTimeoutIdRef.current)
            dragEndTimeoutIdRef.current = null
        }
        isDraggingRef.current = false
    }, [])

    const handleTouchMove = useCallback(() => {
        touchMoveRef.current = true
        isDraggingRef.current = true
        if (currentShowTooltipRef.current) {
            setShowTooltip(false)
        }
    }, [])

    const handleTouchEnd = useCallback(() => {
        if (!touchMoveRef.current && !isDraggingRef.current) {
            setTimeout(() => {
                if (isDraggingRef.current) {
                    setShowTooltip(false)
                    return
                }
                if (cellRef.current) {
                    const rect = cellRef.current.getBoundingClientRect()
                    setTooltipPosition({top: rect.bottom, left: rect.left})
                }
                setShowTooltip(true)
                ignoreTooltipCloseRef.current = true
            }, 0)
        } else {
            setShowTooltip(false)
            isDraggingRef.current = true
            if (dragEndTimeoutIdRef.current) {
                clearTimeout(dragEndTimeoutIdRef.current)
            }
            dragEndTimeoutIdRef.current = setTimeout(() => {
                isDraggingRef.current = false
                dragEndTimeoutIdRef.current = null
            }, 0)
        }
    }, [setTooltipPosition])

    useEffect(() => {
        if (!params.eGridCell) {
            return
        }
        params.eGridCell.addEventListener("touchstart", handleTouchStart, {passive: true})
        params.eGridCell.addEventListener("touchend", handleTouchEnd)
        document.addEventListener("touchmove", handleTouchMove, {passive: true})
        return () => {
            params.eGridCell?.removeEventListener("touchstart", handleTouchStart)
            params.eGridCell?.removeEventListener("touchend", handleTouchEnd)
            document.removeEventListener("touchmove", handleTouchMove)
            if (dragEndTimeoutIdRef.current) {
                clearTimeout(dragEndTimeoutIdRef.current)
                dragEndTimeoutIdRef.current = null
            }
        }
    }, [handleTouchEnd, handleTouchMove, handleTouchStart, params.eGridCell, showTooltip])

    const portalRoot = document.getElementById("portal-root")
    if (!portalRoot) {
        console.error("portalRoot not found")
        return null
    }

    return (
        <button
            ref={cellRef}
            className={"tama-image-span cell-not-button"}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {params.value && (
                <img
                    className={"tama-image-small"}
                    src={params.value}
                    alt={params.value}
                />
            )}
            {showTooltip && ReactDOM.createPortal(
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
