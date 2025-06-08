import * as React from "react"
import {type RefObject, useCallback, useEffect, useRef, useState} from "react"

interface TooltipProps {
    elementForListeners: HTMLElement
}

interface TooltipReturn {
    showTooltip: boolean;
    tooltipPosition: { top: number; left: number }
    targetRef: RefObject<HTMLElement | null>
    tooltipRef: RefObject<HTMLDivElement | null>
    handleMouseEnter: React.MouseEventHandler<HTMLElement>
    handleMouseLeave: React.MouseEventHandler<HTMLElement>
}

export default function useTooltip({elementForListeners}: TooltipProps): TooltipReturn {
    const [showTooltip, setShowTooltip] = useState(false)
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number, left: number }>({top: 0, left: 0})
    const targetRef = useRef<HTMLElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const touchMoveRef = useRef(false)
    const ignoreTooltipCloseRef = useRef(false)
    const isDraggingRef = useRef(false)
    const dragEndTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)
    const currentShowTooltipRef = useRef(showTooltip)

    useEffect(() => {
        currentShowTooltipRef.current = showTooltip
    }, [showTooltip])

    const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        if (targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect()
            setTooltipPosition({top: rect.bottom, left: rect.left})
        }
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

    const handleTouchEnd = useCallback(() => {
        if (!touchMoveRef.current && !isDraggingRef.current) {
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
