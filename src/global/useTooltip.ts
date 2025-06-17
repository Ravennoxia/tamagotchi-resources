import * as React from "react"
import {type RefObject, useCallback, useEffect, useRef, useState} from "react"

interface TooltipProps {
    elementForListeners: HTMLElement,
    horizontalCenter: boolean,
    gridDiv?: Element | Window | null,
    isHeader?: boolean
}

interface TooltipReturn {
    showTooltip: boolean;
    tooltipPosition: { top: number; left: number }
    targetRef: RefObject<HTMLElement | null>
    tooltipRef: RefObject<HTMLDivElement | null>
    handleMouseEnter: React.MouseEventHandler<HTMLElement>
    handleMouseLeave: React.MouseEventHandler<HTMLElement>
}

export default function useTooltip(
    {
        elementForListeners,
        horizontalCenter,
        gridDiv = window,
        isHeader = false
    }: TooltipProps): TooltipReturn {
    const [intentToShowTooltip, setIntentToShowTooltip] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false)
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number, left: number }>({top: 0, left: 0})
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const targetRef = useRef<HTMLElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)

    const getAGGridContainer = useCallback(() => {
        if (gridDiv instanceof Element) {
            const viewport = gridDiv?.querySelector(".ag-body-viewport") || gridDiv?.querySelector(".ag-center-cols-viewport")
            if (viewport) {
                return viewport as HTMLElement
            }
        }
        return window
    }, [gridDiv])

    const gridContainer = getAGGridContainer()

    const calculatePosition = useCallback(() => {
        if (targetRef.current instanceof HTMLElement && tooltipRef.current instanceof HTMLDivElement) {
            const targetRect = targetRef.current.getBoundingClientRect()
            const tooltipRect = tooltipRef.current.getBoundingClientRect()
            const containerRect = getContainerRect(gridContainer)

            if (targetRect.width > 0 && targetRect.height > 0 &&
                tooltipRect.width > 0 && tooltipRect.height > 0) {
                setTooltipPosition({
                    top: getTopPosition(targetRect, tooltipRect, containerRect, isHeader),
                    left: getLeftPosition(targetRect, tooltipRect, containerRect, horizontalCenter)
                })
            }
        }
    }, [horizontalCenter, isHeader, gridContainer])

    const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        setIntentToShowTooltip(true)
    }, [])

    const handleMouseLeave = useCallback(() => {
        setIntentToShowTooltip(false)
        setShowTooltip(false)
    }, [])

    const handleTouchStart = useCallback(() => {
        setIntentToShowTooltip(false)
        setShowTooltip(false)
    }, [])

    const handleTouchMove = useCallback(() => {
        setIntentToShowTooltip(false)
        setShowTooltip(false)
        setIsDragging(true)
    }, [])

    const handleTouchEnd = useCallback(() => {
        if (isDragging) {
            setIsDragging(false)
            setIntentToShowTooltip(false)
            setShowTooltip(false)
        } else {
            setIntentToShowTooltip(true)
        }
    }, [isDragging])

    useEffect(() => {
        if (!elementForListeners) {
            return
        }
        elementForListeners.addEventListener("touchstart", handleTouchStart, {passive: true})
        elementForListeners.addEventListener("touchend", handleTouchEnd)
        document.addEventListener("touchmove", handleTouchMove, {passive: true})
        return () => {
            elementForListeners?.removeEventListener("touchstart", handleTouchStart)
            elementForListeners?.removeEventListener("touchend", handleTouchEnd)
            document.removeEventListener("touchmove", handleTouchMove)
        }
    }, [elementForListeners, handleTouchEnd, handleTouchMove, handleTouchStart])

    useEffect(() => {
        calculatePosition()
        if (intentToShowTooltip && tooltipPosition.left > 0 && tooltipPosition.top > 0) {
            setShowTooltip(true)
        } else {
            setShowTooltip(false)
        }
    }, [calculatePosition, intentToShowTooltip, tooltipPosition.left, tooltipPosition.top])

    return {
        showTooltip,
        tooltipPosition,
        targetRef,
        tooltipRef,
        handleMouseEnter,
        handleMouseLeave
    }
}

function getContainerRect(scrollContainer: HTMLElement | (Window & typeof globalThis)) {
    if (scrollContainer instanceof HTMLElement) {
        return scrollContainer.getBoundingClientRect()
    }
    return new DOMRect(0, 0, window.innerWidth, window.innerHeight)
}

function getLeftPosition(targetRect: DOMRect, tooltipRect: DOMRect, containerRect: DOMRect, horizontalCenter: boolean) {
    let left = targetRect.left
    if (horizontalCenter) {
        left = (targetRect.left + targetRect.width / 2) - (tooltipRect.width / 2)
    }
    if (left + tooltipRect.width > containerRect.right) {
        return containerRect.right - tooltipRect.width
    }
    if (left < containerRect.left) {
        return containerRect.left
    }
    return left
}

function getTopPosition(targetRect: DOMRect, tooltipRect: DOMRect, containerRect: DOMRect, isHeader: boolean) {
    let top = targetRect.bottom
    if (isHeader) {
        return top + 14.5
    }
    if (containerRect && !isHeader) {
        const tooltipBottom = top + tooltipRect.height
        const containerBottom = containerRect.bottom
        if (tooltipBottom > containerBottom) {
            top = containerBottom - tooltipRect.height
            return Math.max(top, containerRect.top)
        }
    }
    return top
}
