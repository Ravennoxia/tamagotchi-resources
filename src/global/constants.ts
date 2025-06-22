export const ROUTES = {
    home: "/",
    tamaTable: "/raisable-characters-table",
    tamaTimeline: "/device-timeline",
    bitzeeTable: "/bitzee-table"
}

export const PHONE_BREAKPOINT = 600

export const COLUMN_NAMES = {
    "original": ["OG", "Original"],
    "osuMesu": ["OsuMesu", "Osutchi & Mesutchi"],
    "v1": ["v1", "Plus / Connection"],
    "v2": ["v2", "Keitai / Connection V2"],
    "mini": ["Mini", "Mini"],
    "v3": ["v3", "Akai / Connection V3 / 2024"],
    "v4": ["v4", "Entama / Uratama / Connection V4 / V4.5"],
    "chu": ["Chu", "TamagoChu"],
    "v5": ["v5", "Familitchi / Royal Family / Celebrity"],
    "v6": ["v6", "Connection Music Star"],
    "tamaGo": ["Go", "TamaTown Tama-Go"],
    "nano": ["Nano", "Nano"],
    "friends": ["Friends", "Friends & Dream Town"],
    "pac-man": ["PcMn", "Pac-Man"],
    "helloKitty": ["HKitty", "Hello Kitty"],
    "plusColor": ["+C", "+Color"],
    "iD": ["iD", "iD / iD L"],
    "Ps": ["P's", "P's"],
    "4U": ["4U", "4U / 4U+"],
    "mix": ["M!x", "M!x"],
    "on": ["On", "Meets / On / Some"],
    "pix": ["Pix", "Pix & Party"],
    "smart": ["Smart", "Smart"],
    "uni": ["Uni", "Uni"],
    "paradise": ["Paradise", "Paradise"]
}

export const STAGE_FILTER_OPTIONS = {
    baby: "Baby",
    child: "Child",
    teen: "Teen",
    adult: "Adult",
    senior: "Senior",
    parent: "Parent",
    pet: "Pet",
    costume: "Costume"
}
export const GENDER_FILTER_OPTIONS = {
    female: "Female",
    male: "Male",
    other: "Other"
}

export const DEVICE_FILTER_OPTIONS = {
    blackAndWhite: "Black & White",
    color: "Color"
}

export const BLACK_AND_WHITE_DEVICES = [
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

export const COLOR_DEVICES = [
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

export const ALL_DEVICE_COLUMNS = [
    {version: "original", field: "spriteOriginal", type: "blackAndWhite"},
    {version: "osuMesu", field: "spriteOsuMesu", type: "blackAndWhite"},
    {version: "v1", field: "spriteV1", type: "blackAndWhite"},
    {version: "v2", field: "spriteV2", type: "blackAndWhite"},
    {version: "mini", field: "spriteMini", type: "blackAndWhite"},
    {version: "v3", field: "spriteV3", type: "blackAndWhite"},
    {version: "v4", field: "spriteV4", type: "blackAndWhite"},
    {version: "chu", field: "spriteChu", type: "blackAndWhite"},
    {version: "v5", field: "spriteV5", type: "blackAndWhite"},
    {version: "v6", field: "spriteV6", type: "blackAndWhite"},
    {version: "tamaGo", field: "spriteTamaGo", type: "blackAndWhite"},
    {version: "nano", field: "spriteNano", type: "blackAndWhite"},
    {version: "friends", field: "spriteFriends", type: "blackAndWhite"},
    {version: "pac-man", field: "spritePacMan", type: "blackAndWhite"},
    {version: "helloKitty", field: "spriteHelloKitty", type: "blackAndWhite"},
    {version: "plusColor", field: "spritePlusColor", type: "color"},
    {version: "iD", field: "spriteID", type: "color"},
    {version: "Ps", field: "spritePs", type: "color"},
    {version: "4U", field: "sprite4U", type: "color"},
    {version: "mix", field: "spriteMix", type: "color"},
    {version: "on", field: "spriteOn", type: "color"},
    {version: "pix", field: "spritePix", type: "color"},
    {version: "smart", field: "spriteSmart", type: "color"},
    {version: "uni", field: "spriteUni", type: "color"},
    {version: "paradise", field: "spriteParadise", type: "color"}
]

export const DEVICE_NAMES = {
    "p1": "Original P1",
    "p2jp": "Original P2 Japanese",
    "p2en": "Original P2 International",

    "osu": "Osutchi",
    "mesu": "Mesutchi",

    "v1": "Plus / Connection",

    "keitai": "Keitai",
    "v2": "Connection V2",

    "miniJP": "Mini Japanese",
    "miniEN": "Mini International",
    "miniGL": "Mini Good Luck",
    "mini20": "Mini 20th Anniversary",

    "akai": "Akai",
    "v3": "Connection V3",
    "rv3": "Connection 2024",

    "entama": "Entama",
    "v4": "Connection V4",
    "uratama": "Uratama",
    "v4.5": "Connection V4.5",

    "chu": "TamagoChu",

    "v5": "Familitchi / Connection V5",
    "v5.5": "Royal Family / Connection V5.5 Celebrity",

    "v6": "Connection V6 Music Star",

    "plusColor": "+Color",

    "iD": "iD",
    "iDLM": "iD Lovely Melody",
    "iDL": "iD L",
    "iDL15": "iD L 15th Anniversary",
    "iDLPS": "iD L Princess Spacy",

    "tamaGo": "TamaTown Tama-Go",

    "nanoV1": "Nano V1",
    "nanoV2": "Nano V2",

    "Ps": "P's",
    "PsLM": "P's Love & Melody",
    "PsSC": "P's Tama Star Circus",
    "PsML": "P's Melody Land",
    "PsBS": "P's Berry Sweets",
    "PsDC": "P's Dream Coffret",
    "PsMc": "P's Miracrise",

    "friends": "Friends",
    "friendsDT": "Friends Dream Town",

    "4U": "4U",
    "4UD": "4U Downloadable",
    "4U+": "4U+",
    "4U+D": "4U+ Downloadable",

    "mix": "m!x",
    "mix20": "m!x 20th Anniversary",
    "mixS": "m!x Sanrio",
    "mixD": "m!x Dream",

    "on": "Meets / On / Some",
    "onPastel": "Meets Pastel",
    "onSanrio": "Meets Sanrio",
    "onFantasy": "Meets Fantasy",
    "onWG": "On Wonder Garden",
    "onSweets": "Meets Sweets",

    "pac-man": "Pac-Man",

    "helloKittyV1": "Hello Kitty 2020",
    "helloKittyV2": "Hello Kitty 2024",

    "pix": "Pix",
    "pixP": "Pix Party",

    "smart": "Smart",
    "smart96": "Smart 1996 Friends",
    "smartRainbow": "Smart Rainbow Friends",
    "smartSweets": "Smart Sweets Friends",
    "smartCosmetic": "Smart Cosmetic Friends",
    "smartGourmet": "Smart Gourmet Friends",
    "smartMelody": "Smart Melody Friends",
    "smartPastel": "Smart Pastel Friends",
    "smartAnniversary": "Smart Anniversary Party Friends",
    "smartKei": "Smart Kei-Tama Friends",
    "smartEn": "Smart En-Tama Friends",

    "uni": "Uni",
    "uniBerry": "Uni Very Berry Land",
    "uniLM": "Uni LoveMelo Concert",
    "uniFS": "Uni Tamamori Fashion Show",
    "uniSanrio": "Uni Sanrio Characters",
    "uniAngel": "Uni Angel Festival",
    "uniMonster": "Uni Monster Carnival",
    "uniFT": "Uni Fairy Tale Library",
    "uniPP": "Uni PokoPea Land",
    "uniDS": "Uni DoriTama School",

    "paradise": "Paradise"
}
