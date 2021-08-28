import { GetMaterialName } from '../resources/app/Language'
import internalMinecraftData from '../resources/items/item_json.json'
import i18n from "i18next"

const Items = internalMinecraftData as MinecraftItem[]

let cachedItems : TranslatedMinecraftItem[] | undefined = undefined
let cachedItemsLang : string = "not_defined"

export const GetTranslatedItems = () : TranslatedMinecraftItem[] => {
    if(cachedItemsLang === i18n.language) {
        if(cachedItems !== undefined) {
            return cachedItems
        }
    }

    cachedItems = Items.map((item) => {
        let translation = GetMaterialName(item.name)
    
        return {
            ...item,
            mixedLabel: (translation === undefined ? item.label : translation + "|" + item.label),
            translatedLabel: (translation === undefined ? item.label : translation)
        } as TranslatedMinecraftItem
    })
    cachedItemsLang = i18n.language

    return cachedItems
}

export function GetItemByName(name: ItemName) : TranslatedMinecraftItem | undefined {
    let nameLowerCase = name.toLowerCase() //en caso de que sea un nombre en mayusculas desde Spigot
    return GetTranslatedItems().find((e) => e.name === nameLowerCase)
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
