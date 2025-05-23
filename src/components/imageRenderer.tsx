import type {ICellRendererComp, ICellRendererParams} from "ag-grid-community"

export default class ImageRenderer implements ICellRendererComp {
    eGui!: HTMLSpanElement

    init(params: ICellRendererParams) {
        const image: HTMLImageElement = document.createElement("img")
        image.src = "/" + params.value + ".png"
        image.setAttribute("class", "image")
        this.eGui = document.createElement("span")
        this.eGui.setAttribute("class", "imageSpan")
        this.eGui.appendChild(image)
    }

    getGui(): HTMLSpanElement {
        return this.eGui
    }

    refresh(): boolean {
        return false
    }
}
