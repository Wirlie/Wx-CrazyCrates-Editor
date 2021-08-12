export const constant_enchantments = [
    "sweeping",
    "knockback",
    "sharpness",
    "smite",
    "looting",
    "fire_aspect",
    "bane_of_arthropods",
    "efficiency",
    "silk_touch",
    "fortune",
    "punch",
    "power",
    "flame",
    "infinity",
    "riptide",
    "impaling",
    "channeling",
    "loyalty",
    "thorns",
    "unbreaking",
    "mending",
    "vanishing_curse",
    "binding_curse",
    "lure",
    "luck_of_the_sea",
    "fire_protection",
    "projectile_protection",
    "protection",
    "blast_protection",
    "respiration",
    "aqua_affinity",
    "frost_walker",
    "feather_falling",
    "depth_strider",
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