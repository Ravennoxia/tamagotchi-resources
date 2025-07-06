export interface AllTamaData {
    [characterName: string]: TamaData
}

export interface TamaData {
    link: string
    image: string
    gender: string
    versions: VersionData[]
}

export interface VersionData {
    version: string
    devices: string[]
    stage: string
    gender: string
    sprite: string
}

export interface TamaRow {
    image: string
    name: string
    link: string
    gender: string
    versions: VersionData[]
    spriteOriginal: string | null
    spriteOsuMesu: string | null
    spriteV1: string | null
    spriteV2: string | null
    spriteMini: string | null
    spriteV3: string | null
    spriteV4: string | null
    spriteChu: string | null
    spriteV5: string | null
    spriteV6: string | null
    spriteTamaGo: string | null
    spriteNano: string | null
    spriteFriends: string | null
    spritePacMan: string | null
    spriteHelloKitty: string | null
    spritePlusColor: string | null
    spriteID: string | null
    spritePs: string | null
    sprite4U: string | null
    spriteMix: string | null
    spriteOn: string | null
    spritePix: string | null
    spriteSmart: string | null
    spriteUni: string | null
    spriteParadise: string | null
}

export interface TamaTimelineEventRow {
    asia: TamaTimelineItem | null
    international: TamaTimelineItem | null
    year: number
}

export interface TamaTimelineItem {
    id: string
    region: "asia" | "international"
    name: string
    text?: string | null
    releaseDate: string
    hasOther?: boolean
    link?: string
    image?: string
}

export interface UniAccessory {
    name: string
    image: string | null
    source: string
}

export interface UniOutfitPreviewItem {
    item: UniAccessory | null
    x: number
    y: number
}

export interface AllBitzeeData {
    [characterName: string]: BitzeeData
}

export interface BitzeeData {
    rarity: string
    gem: string | null
    baby: string | null
    adult: string | null
    superBitzee: string | null
    blue: string | null
    red: string | null
    green: string | null
}

export interface BitzeeRow {
    name: string
    rarity: string
    gem: string | null
    baby: string | null
    adult: string | null
    superBitzee: string | null
    blue: string | null
    red: string | null
    green: string | null
}
