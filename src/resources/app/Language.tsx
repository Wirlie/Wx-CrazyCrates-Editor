import { Enchantment, ItemFlag } from './Constants'
import languageDataEsMX from './es_MX.json'
import languageDataEnUS from './en_US.json'
import i18n from "i18next"

const LanguageEntriesEsMx = languageDataEsMX as { [key : string] : string }
const LanguageEntriesEnUs = languageDataEnUS as { [key : string] : string }

function GetLanguageEntry(entry : string) {
    return i18n.language === "esMX" ? LanguageEntriesEsMx[entry] : LanguageEntriesEnUs[entry]
}

export function GetMaterialName(materialId: string, appendExtraData = true) : string | undefined {
    
    let materialIdLowerCase = materialId.toLowerCase()
    let tryByBlock = GetLanguageEntry("block.minecraft." + materialIdLowerCase)

    if(tryByBlock !== undefined && tryByBlock !== null) {
        return AppendExtraData(materialId, tryByBlock, appendExtraData)
    }

    let tryByMaterial = GetLanguageEntry("item.minecraft." + materialIdLowerCase)

    if(tryByMaterial !== undefined && tryByMaterial !== null) {
        return AppendExtraData(materialId, tryByMaterial, appendExtraData)
    }

    return undefined
}

function AppendExtraData(materialId: string, label: string, apply: boolean) : string {
    if(!apply) return label

    switch(materialId) {
        case "flower_banner_pattern":
            label += " (" + GetLanguageEntry("item.minecraft.flower_banner_pattern.desc") + ")"
            break
        case "globe_banner_pattern":
            label += " (" + GetLanguageEntry("item.minecraft.globe_banner_pattern.desc") + ")"
            break
        case "mojang_banner_pattern":
            label += " (" + GetLanguageEntry("item.minecraft.mojang_banner_pattern.desc") + ")"
            break
        case "piglin_banner_pattern":
            label += " (" + GetLanguageEntry("item.minecraft.piglin_banner_pattern.desc") + ")"
            break
        case "skull_banner_pattern":
            label += " (" + GetLanguageEntry("item.minecraft.skull_banner_pattern.desc") + ")"
            break
        case "creeper_banner_pattern":
            label += " (" + GetLanguageEntry("item.minecraft.creeper_banner_pattern.desc") + ")"
            break
        case "music_disc_11":
            label += " (" + GetLanguageEntry("item.minecraft.music_disc_11.desc") + ")"
            break
        case "music_disc_13":
            label += " (" + GetLanguageEntry("item.minecraft.music_disc_13.desc") + ")"
            break
        case "music_disc_blocks":
            label += " (" + GetLanguageEntry("item.minecraft.music_disc_blocks.desc") + ")"
            break
        case "music_disc_cat":
            label += " (" + GetLanguageEntry("item.minecraft.music_disc_cat.desc") + ")"
            break
        case "music_disc_chirp":
            label += " (" + GetLanguageEntry("item.minecraft.music_disc_chirp.desc") + ")"
            break
        case "music_disc_far":
            label += " (" + GetLanguageEntry("item.minecraft.music_disc_far.desc") + ")"
            break
        case "music_disc_mall":
            label += " (" + GetLanguageEntry("item.minecraft.music_disc_mall.desc") + ")"
            break
        case "music_disc_mellohi":
            label += " (" + GetLanguageEntry("item.minecraft.music_disc_mellohi.desc") + ")"
            break
        case "music_disc_pigstep":
            label += " (" + GetLanguageEntry("item.minecraft.music_disc_pigstep.desc") + ")"
            break
        case "music_disc_stal":
            label += " (" + GetLanguageEntry("item.minecraft.music_disc_stal.desc") + ")"
            break
        case "music_disc_strad":
            label += " (" + GetLanguageEntry("item.minecraft.music_disc_strad.desc") + ")"
            break
        case "music_disc_wait":
            label += " (" + GetLanguageEntry("item.minecraft.music_disc_wait.desc") + ")"
            break
        case "music_disc_ward":
            label += " (" + GetLanguageEntry("item.minecraft.music_disc_ward.desc") + ")"
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
    return i18n.t("itemflag_" + flag)
}