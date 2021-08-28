export const constant_enchantments = [
    "aqua_affinity",
    "bane_of_arthropods",
    "blast_protection",
    "channeling",
    "binding_curse",
    "vanishing_curse",
    "depth_strider",
    "efficiency",
    "feather_falling",
    "fire_aspect",
    "fire_protection",
    "flame",
    "fortune",
    "frost_walker",
    "impaling",
    "infinity",
    "knockback",
    "looting",
    "loyalty",
    "luck_of_the_sea",
    "lure",
    "mending",
    "multishot",
    "piercing",
    "power",
    "projectile_protection",
    "protection",
    "punch",
    "quick_charge",
    "respiration",
    "riptide",
    "sharpness",
    "silk_touch",
    "smite",
    "soul_speed",
    "sweeping",
    "thorns",
    "unbreaking",
    "unknown"
] as const


export type Enchantment = typeof constant_enchantments[number]

export interface EnchantmentAndLevel {
    enchantment: Enchantment,
    level: number
}

export const constant_pottion_effects = [
    "FIRE_RESISTANCE",
    "HARM",
    "HEAL",
    "INVISIBILITY",
    "JUMP",
    "LUCK",
    "NIGHT_VISION",
    "POISON",
    "REGENERATION",
    "SLOW",
    "SPEED",
    "INCREASE_DAMAGE",
    "WATER_BREATHING",
    "WEAKNESS"
] as const

export type PotionEffect = typeof constant_pottion_effects[number]

export const constant_leather_colors = [
    "AQUA",
    "BLACK",
    "BLUE",
    "FUCHSIA",
    "GRAY",
    "GREEN",
    "LIME",
    "MAROON",
    "NAVY",
    "OLIVE",
    "ORANGE",
    "PURPLE",
    "RED",
    "SILVER",
    "TEAL",
    "WHITE",
    "YELLOW"
] as const

export type LeatherColor = typeof constant_leather_colors[number]

export interface LeatherRGBColor {
    red: number,
    green: number,
    blue: number
}

export const constant_item_flags = [
    "HIDE_ATTRIBUTES",
    "HIDE_DESTROYS",
    "HIDE_DYE",
    "HIDE_ENCHANTS",
    "HIDE_PLACED_ON",
    "HIDE_POTION_EFFECTS",
    "HIDE_UNBREAKABLE"
] as const

export type ItemFlag = typeof constant_item_flags[number]