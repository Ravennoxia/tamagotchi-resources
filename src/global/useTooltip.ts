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
    const [showTooltip, setShowTooltip] = useState(false)
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number, left: number }>({top: 0, left: 0})
    const targetRef = useRef<HTMLElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const touchMoveRef = useRef(false)
    const ignoreTooltipCloseRef = useRef(false)
    const isDraggingRef = useRef(false)
    const dragEndTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)
    const currentShowTooltipRef = useRef(showTooltip)

    const getAGGridScrollContainer = useCallback(() => {
        if (gridDiv instanceof Element) {
            const viewport = gridDiv?.querySelector(".ag-body-viewport") || gridDiv?.querySelector(".ag-center-cols-viewport")
            if (viewport) {
                return viewport as HTMLElement
            }
        }
        return window
    }, [gridDiv])

    const scrollContainer = getAGGridScrollContainer()

    useEffect(() => {
        currentShowTooltipRef.current = showTooltip
    }, [showTooltip])

    const calculatePosition = useCallback(() => {
        if (showTooltip && targetRef.current && tooltipRef.current) {
            const targetRect = targetRef.current.getBoundingClientRect()
            const tooltipRect = tooltipRef.current.getBoundingClientRect()
            const containerRect = getContainerRect(scrollContainer)

            setTooltipPosition({
                top: getTopPosition(targetRect, tooltipRect, containerRect, isHeader),
                left: getLeftPosition(targetRect, tooltipRect, containerRect, horizontalCenter)
            })
        }
    }, [horizontalCenter, isHeader, scrollContainer, showTooltip])

    useEffect(() => {
        if (showTooltip) {
            const initialCalcTimeout = setTimeout(() => {
                calculatePosition()
            }, 0)
            const handleScroll = () => {
                calculatePosition()
            }
            scrollContainer.addEventListener("scroll", handleScroll, {passive: true})
            window.addEventListener("resize", calculatePosition)
            return () => {
                clearTimeout(initialCalcTimeout)
                scrollContainer.removeEventListener("scroll", handleScroll)
                window.removeEventListener("resize", calculatePosition)
            }
        }
    }, [calculatePosition, scrollContainer, showTooltip])

    const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        setShowTooltip(true)
    }, [])

    const handleMouseLeave = useCallback(() => {
        setShowTooltip(false)
    }, [])

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

    const handleTouchEnd = useCallback((event: TouchEvent) => {
        if (!event.defaultPrevented && !touchMoveRef.current && !isDraggingRef.current) {
            setTimeout(() => {
                if (isDraggingRef.current) {
                    setShowTooltip(false)
                    return
                }
                if (targetRef.current) {
                    const rect = targetRef.current.getBoundingClientRect()
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
        const handleTooltipClose = (event: TouchEvent) => {
            if (ignoreTooltipCloseRef.current) {
                ignoreTooltipCloseRef.current = false
                return
            }
            const insideCellButton = targetRef.current?.contains(event.target as Node)
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
            if (dragEndTimeoutIdRef.current) {
                clearTimeout(dragEndTimeoutIdRef.current)
                dragEndTimeoutIdRef.current = null
            }
        }
    }, [elementForListeners, handleTouchEnd, handleTouchMove, handleTouchStart])

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
    const left = targetRect.left
    if (horizontalCenter) {
        return (targetRect.left + targetRect.width / 2) - (tooltipRect.width / 2)
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
