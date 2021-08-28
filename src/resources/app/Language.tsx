import { Enchantment, ItemFlag } from './Constants'
import languageData from './es_MX.json'
import i18n from "i18next"
export const LanguageEntries = languageData as { [key : string] : string }

export function GetMaterialName(materialId: string, appendExtraData = true) : string | undefined {
    
    let materialIdLowerCase = materialId.toLowerCase()
    let tryByBlock = LanguageEntries["block.minecraft." + materialIdLowerCase]

    if(tryByBlock !== undefined && tryByBlock !== null) {
        return AppendExtraData(materialId, tryByBlock, appendExtraData)
    }

    let tryByMaterial = LanguageEntries["item.minecraft." + materialIdLowerCase]

    if(tryByMaterial !== undefined && tryByMaterial !== null) {
        return AppendExtraData(materialId, tryByMaterial, appendExtraData)
    }

    return undefined
}

function AppendExtraData(materialId: string, label: string, apply: boolean) : string {
    if(!apply) return label

    switch(materialId) {
        case "flower_banner_pattern":
            label += " (" + LanguageEntries["item.minecraft.flower_banner_pattern.desc"] + ")"
            break
        case "globe_banner_pattern":
            label += " (" + LanguageEntries["item.minecraft.globe_banner_pattern.desc"] + ")"
            break
        case "mojang_banner_pattern":
            label += " (" + LanguageEntries["item.minecraft.mojang_banner_pattern.desc"] + ")"
            break
        case "piglin_banner_pattern":
            label += " (" + LanguageEntries["item.minecraft.piglin_banner_pattern.desc"] + ")"
            break
        case "skull_banner_pattern":
            label += " (" + LanguageEntries["item.minecraft.skull_banner_pattern.desc"] + ")"
            break
        case "creeper_banner_pattern":
            label += " (" + LanguageEntries["item.minecraft.creeper_banner_pattern.desc"] + ")"
            break
        case "music_disc_11":
            label += " (" + LanguageEntries["item.minecraft.music_disc_11.desc"] + ")"
            break
        case "music_disc_13":
            label += " (" + LanguageEntries["item.minecraft.music_disc_13.desc"] + ")"
            break
        case "music_disc_blocks":
            label += " (" + LanguageEntries["item.minecraft.music_disc_blocks.desc"] + ")"
            break
        case "music_disc_cat":
            label += " (" + LanguageEntries["item.minecraft.music_disc_cat.desc"] + ")"
            break
        case "music_disc_chirp":
            label += " (" + LanguageEntries["item.minecraft.music_disc_chirp.desc"] + ")"
            break
        case "music_disc_far":
            label += " (" + LanguageEntries["item.minecraft.music_disc_far.desc"] + ")"
            break
        case "music_disc_mall":
            label += " (" + LanguageEntries["item.minecraft.music_disc_mall.desc"] + ")"
            break
        case "music_disc_mellohi":
            label += " (" + LanguageEntries["item.minecraft.music_disc_mellohi.desc"] + ")"
            break
        case "music_disc_pigstep":
            label += " (" + LanguageEntries["item.minecraft.music_disc_pigstep.desc"] + ")"
            break
        case "music_disc_stal":
            label += " (" + LanguageEntries["item.minecraft.music_disc_stal.desc"] + ")"
            break
        case "music_disc_strad":
            label += " (" + LanguageEntries["item.minecraft.music_disc_strad.desc"] + ")"
            break
        case "music_disc_wait":
            label += " (" + LanguageEntries["item.minecraft.music_disc_wait.desc"] + ")"
            break
        case "music_disc_ward":
            label += " (" + LanguageEntries["item.minecraft.music_disc_ward.desc"] + ")"
            break
        default:
            break
    }

    return label
}

export function GetEnchantmentName(enchantment : Enchantment) : string {
    return i18n.t("enchantment_" + enchantment)
}

export function GetEnchantmentLevelAsRoman(level : number) : string {
    switch(level) {
        case 1:
            return "I"
        case 2:
            return "II"
        case 3:
            return "III"
        case 4:
            return "IV"
        case 5:
            return "V"
        case 6:
            return "VI"
        case 7:
            return "VII"
        case 8:
            return "VIII"
        case 9:
            return "IX"
        case 10:
            return "X"
        default:
            return level + ""
    }
}

export function GetItemFlagName(flag : ItemFlag) : string {
    switch(flag) {
        case "HIDE_ATTRIBUTES":
            return "Ocultar atributos del ítem (daño)"
        case "HIDE_DESTROYS":
            return "Ocultar qué cosas puede destruir el ítem"
        case "HIDE_DYE":
            return "Ocultar coloración del ítem (cuero)"
        case "HIDE_ENCHANTS":
            return "Ocultar encantamientos"
        case "HIDE_PLACED_ON":
            return "Ocultar en donde se puede colocar el ítem"
        case "HIDE_POTION_EFFECTS":
            return "Ocultar efectos de pociones"
        case "HIDE_UNBREAKABLE":
            return "Ocultar si el ítem es irrompible o no"
    }
}