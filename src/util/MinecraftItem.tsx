import { GetMaterialName } from '../resources/app/Language'
import internalMinecraftData from '../resources/items/item_json.json'

const Items = internalMinecraftData as MinecraftItem[]

export const TranslatedItems = Items.map((item) => {
    let translation = GetMaterialName(item.name)

    return {
        ...item,
        mixedLabel: (translation === undefined ? item.label : translation + "|" + item.label),
        translatedLabel: (translation === undefined ? item.label : translation)
    } as TranslatedMinecraftItem
})

export function GetItemByName(name: ItemName) : TranslatedMinecraftItem | undefined {
    let nameLowerCase = name.toLowerCase() //en caso de que sea un nombre en mayusculas desde Spigot
    return TranslatedItems.find((e) => e.name === nameLowerCase)
}

export type ItemName = "acacia_boat" | "air" | "stone"

interface MinecraftItem {
    label: string,
    name: string,
    css: string
}

export interface TranslatedMinecraftItem extends MinecraftItem {
    translatedLabel: string,
    mixedLabel: string
}
