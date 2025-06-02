import type {ICellRendererComp, ICellRendererParams} from "ag-grid-community"

export default class ImageRenderer implements ICellRendererComp {
    eGui!: HTMLSpanElement
    image!: HTMLImageElement

    init(params: ICellRendererParams) {
        this.eGui = document.createElement("span")
        this.eGui.setAttribute("class", "tama-image-span")

        if (!params.value) {
            return
        }

        this.image = document.createElement("img")
        this.image.setAttribute("class", "tama-image-small")
        this.image.src = params.value

        this.eGui.appendChild(this.image)
    }

    getGui(): HTMLSpanElement {
        return this.eGui
    }

    refresh(): boolean {
        return false
    }
}
