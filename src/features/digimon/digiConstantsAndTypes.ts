import DigimonImageRenderer from "./renderers/DigimonImageRenderer.tsx"
import DigimonAnimatedRenderer from "./renderers/DigimonAnimatedRenderer.tsx"

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
    spritePen20: string | null
    spriteDMX: string | null
    spriteDMXcloseUp: string | null
    spritePenZ: string | null
    spritePenZcloseUp: string | null
    spriteDMC: string | null
    spritePenC: string | null
}

export const DIGI_DEVICE_COLUMNS = [
    {version: "DM", sprite: "spriteDM", image: 0, width: 74, renderer: DigimonImageRenderer},
    {version: "Pen", sprite: "spritePen", image: 0, width: 74, renderer: DigimonImageRenderer},
    {version: "DM20", sprite: "spriteDM20", image: 0, width: 74, renderer: DigimonImageRenderer},
    {version: "Pen20", sprite: "spritePen20", image: 0, width: 74, renderer: DigimonImageRenderer},
    {version: "DMX", sprite: "spriteDMX", image: 0, width: 74, renderer: DigimonImageRenderer},
    {version: "DMX", sprite: "spriteDMXcloseUp", image: 1, width: 148, renderer: DigimonImageRenderer},
    {version: "PenZ", sprite: "spritePenZ", image: 0, width: 74, renderer: DigimonImageRenderer},
    {version: "PenZ", sprite: "spritePenZcloseUp", image: 1, width: 148, renderer: DigimonImageRenderer},
    {version: "DMC", sprite: "spriteDMC", image: 0, width: 74, renderer: DigimonAnimatedRenderer},
    {version: "PenC", sprite: "spritePenC", image: 0, width: 74, renderer: DigimonAnimatedRenderer}
]
