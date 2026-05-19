import DigimonImageRenderer from "./renderers/DigimonImageRenderer.tsx"

export interface AllDigiData {
    [characterName: string]: DigiData
}

export interface DigiData {
    name: string
    images: string[]
    versions: DigiVersionData[]
}

export interface DigiVersionData {
    device: string
    devices: string[]
    stage: string
    sprites: string[]
}

export interface DigiRow {
    image: string
    name: string
    versions: DigiVersionData[]
    spriteDM: string | null
    spritePen: string | null
    spriteDM20: string | null
}

export const DIGI_DEVICE_COLUMNS = [
    {version: "DM", renderer: DigimonImageRenderer},
    {version: "Pen", renderer: DigimonImageRenderer},
    {version: "DM20", renderer: DigimonImageRenderer}
]
