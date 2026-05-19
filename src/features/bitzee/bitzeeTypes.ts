export interface AllBitzeeData {
    [characterName: string]: BitzeeData
}

export interface BitzeeData {
    rarity: string
    gem: string | null
    baby: string | null
    adult: string | null
    superBitzee: string | null
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
    red: string | null
    green: string | null
}
