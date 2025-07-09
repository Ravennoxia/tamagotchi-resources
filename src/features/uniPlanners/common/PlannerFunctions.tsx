import {type Dispatch, type RefObject, type SetStateAction} from "react"
import type {UniPreviewItem} from "../../../global/types.ts"
import * as htmlToImage from "html-to-image"

function getBoundingBoxOfImages(container: HTMLElement) {
    let minX = 100
    let minY = 100
    let maxX = 0
    let maxY = 0
    const images = container.querySelectorAll(".display-image")
    if (images.length === 0) {
        return null
    }
    images.forEach(imgElement => {
        const rect = imgElement.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const currentMinX = rect.left - containerRect.left
        const currentMinY = rect.top - containerRect.top
        const currentMaxX = rect.right - containerRect.left
        const currentMaxY = rect.bottom - containerRect.top
        minX = Math.min(minX, currentMinX)
        minY = Math.min(minY, currentMinY)
        maxX = Math.max(maxX, currentMaxX)
        maxY = Math.max(maxY, currentMaxY)
    })
    const width = maxX - minX
    const height = maxY - minY
    return {x: minX, y: minY, width, height}
}

export function downloadImage(imageRef: RefObject<HTMLElement | null>, fileName: string) {
    if (imageRef.current) {
        const boundingBox = getBoundingBoxOfImages(imageRef.current)
        if (!boundingBox) {
            console.warn("No images selected to download.")
            return
        }
        htmlToImage
            .toCanvas(imageRef.current, {backgroundColor: "transparent"})
            .then((fullCanvas) => {
                const croppedCanvas = document.createElement("canvas")
                croppedCanvas.width = boundingBox.width
                croppedCanvas.height = boundingBox.height
                const ctx = croppedCanvas.getContext("2d")
                if (!ctx) {
                    console.error("Could not get 2D context for canvas.")
                    return
                }
                ctx.drawImage(
                    fullCanvas,
                    boundingBox.x, boundingBox.y,
                    boundingBox.width, boundingBox.height,
                    0, 0,
                    boundingBox.width, boundingBox.height
                )
                const dataUrl = croppedCanvas.toDataURL("image/png")
                const link = document.createElement("a")
                link.download = fileName + ".png"
                link.href = dataUrl
                link.click()
            })
            .catch((e) => {
                console.error("Could not download image: ", e)
            })
    }
}

export function getPositionCenter(desiredX: number, desiredY: number, elementWidth: number, elementHeight: number)
    : { left: string; top: string } {
    const left = desiredX - (elementWidth / 2)
    const top = desiredY - (elementHeight / 2)
    return {left: `${left}px`, top: `${top}px`}
}

export function getPositionBottom(desiredX: number, desiredY: number, elementWidth: number, elementHeight: number)
    : { left: string; top: string } {
    const left = desiredX - (elementWidth / 2)
    const top = desiredY - elementHeight
    return {left: `${left}px`, top: `${top}px`}
}

export function handleRemoveItem(type: string, setSelectedItems: Dispatch<SetStateAction<Record<string, UniPreviewItem>>>) {
    return function () {
        setSelectedItems(prevItems => ({
            ...prevItems,
            [type]: {
                item: null,
                x: prevItems[type].x,
                y: prevItems[type].y
            }
        }))
    }
}
