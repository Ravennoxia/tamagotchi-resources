export interface AllData {
    [characterName: string]: TamaData
}

export interface TamaData {
    link: string
    image: string
    stage: string[]
    gender: string
    versions: VersionData[]
}

export interface VersionData {
    version: string
    stage: string
    gender: string
    sprite: string
}

export interface IRow {
    image: string
    name: string
    link: string
    stages: string[]
    gender: string
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

export const stageFilterOptions = {
    baby: "Baby",
    child: "Child",
    teen: "Teen",
    adult: "Adult",
    senior: "Senior",
    parent: "Parent",
    pet: "Pet"
}
export const genderFilterOptions = {
    female: "Female",
    male: "Male",
    other: "Other"
}

export const blackAndWhiteDevices = [
    "original",
    "osuMesu",
    "v1",
    "v2",
    "mini",
    "v3",
    "v4",
    "chu",
    "v5",
    "v6",
    "tamaGo",
    "nano",
    "friends",
    "pac-man",
    "helloKitty"
]

export const colorDevices = [
    "plusColor",
    "iD",
    "Ps",
    "4U",
    "mix",
    "on",
    "pix",
    "smart",
    "uni",
    "paradise"
]