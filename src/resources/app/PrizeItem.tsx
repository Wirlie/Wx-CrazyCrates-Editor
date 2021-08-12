import { constant_enchantments, constant_item_flags, constant_leather_colors, constant_pottion_effects, Enchantment, EnchantmentAndLevel, ItemFlag, LeatherColor, LeatherRGBColor, PotionEffect } from "./Constants";

const item_pattern_1 = /^([a-zA-Z_]+)$/ //Item:<Material>
const item_pattern_2 = /^([a-zA-Z_]+):([0-9]+)$/ //Item:<Material>:<Durability>
const item_pattern_3 = /^([a-zA-Z_]+):([0-9]+)#([0-9]+)$/ //Item:<Material>:<Durability>#<Custom Model Data>
const item_pattern_4 = /^([a-zA-Z_]+)#([0-9]+)$/ //Item:<Material>#<Custom Model Data>
const item_pattern_5 = /^([a-zA-Z_]+):([a-zA-Z]+)$/ //Item:<Leather Armor/Potion>:<Color> o Item:<Potion>:<PotionEffect>
const item_pattern_6 = /^([a-zA-Z_]+):([0-9]+),([0-9]+),([0-9]+)$/ //Item:<Leather Armor/Potion>:<Red>,<Green>,<Blue>

export interface PrizeItem {
    item: {
        material: string,
        durability?: number,
        customModelData?: number,
        leatherColor?: LeatherColor,
        leatherRGB?: LeatherRGBColor,
        potionEffect?: PotionEffect
    }
    name?: string,
    lore?: string[],
    amount?: number,
    playerHead?: string,
    unbreakableItem?: boolean,
    enchantments?: EnchantmentAndLevel[],
    itemFlags?: ItemFlag[]
}

export function PrizeItemToString(prizeItem : PrizeItem) : string {
    let toReturn = "Item:" + prizeItem.item.material.toUpperCase()

    if(prizeItem.item.durability !== undefined) {
        toReturn += ":" + prizeItem.item.durability
    }

    if(prizeItem.item.customModelData !== undefined) {
        toReturn += "#" + prizeItem.item.customModelData
    }

    if(prizeItem.item.leatherColor !== undefined) {
        toReturn += ":" + prizeItem.item.leatherColor
    }

    if(prizeItem.item.leatherRGB !== undefined) {
        toReturn += ":" + prizeItem.item.leatherRGB.red + "," + prizeItem.item.leatherRGB.green + "," + prizeItem.item.leatherRGB.blue
    }

    if(prizeItem.item.potionEffect !== undefined) {
        toReturn += ":" + prizeItem.item.potionEffect
    }

    if(prizeItem.name !== undefined) {
        toReturn += ", Name:" + prizeItem.name
    }

    if(prizeItem.lore !== undefined) {
        toReturn += ", Lore:" + (prizeItem.lore!!.join(","))
    }

    if(prizeItem.amount !== undefined) {
        toReturn += ", Amount:" + prizeItem.amount
    }

    if(prizeItem.playerHead !== undefined) {
        toReturn += ", Player:" + prizeItem.playerHead
    }

    if(prizeItem.unbreakableItem !== undefined) {
        toReturn += ", Unbreakable-Item:" + prizeItem.unbreakableItem
    }

    if(prizeItem.enchantments !== undefined) {
        for(let enchantmentLevel of prizeItem.enchantments!!) {
            toReturn += ", " + enchantmentLevel.enchantment.toUpperCase() + ":" + enchantmentLevel.level
        }
    }

    if(prizeItem.itemFlags !== undefined) {
        for(let flag of prizeItem.itemFlags) {
            toReturn += ", " + flag.toUpperCase()
        }
    }

    return toReturn
}

export function StringToPrizeItem(data: string) : PrizeItem | undefined {
    console.log("Reading data: " + data)
    let mainParts = data.split(", ")

    let constructedData = {
        item: {
            material: "undefined"
        }
    } as PrizeItem

    for(let mainPart of mainParts) {
        console.log("Reading mainpart: " + mainPart)
        let subParts = mainPart.split(":")
        console.log("Splitted subparts: (" + subParts.length + ")")
        console.log(subParts)

        if(subParts.length === 2) {
            switch(subParts[0].toLowerCase()) {
                case "item":
                    let match = item_pattern_1.exec(subParts[1])

                    if(match !== null) {
                        console.log("Identified item key (pattern 1)")
                        constructedData = {
                            ...constructedData,
                            item: {
                                material: match[1]
                            }
                        }
                        continue
                    }

                    match = item_pattern_3.exec(subParts[1])

                    if(match !== null) {
                        console.log("Identified item key (pattern 3)")
                        constructedData = {
                            ...constructedData,
                            item: {
                                material: match[1],
                                durability: parseInt(match[2]),
                                customModelData: parseInt(match[3])
                            }
                        }
                        continue
                    }

                    match = item_pattern_4.exec(subParts[1])

                    if(match !== null) {
                        console.log("Identified item key (pattern 4)")
                        constructedData = {
                            ...constructedData,
                            item: {
                                material: match[1],
                                customModelData: parseInt(match[2])
                            }
                        }
                        continue
                    }

                    match = item_pattern_5.exec(subParts[1])

                    if(match !== null) {
                        if(match[1].toLowerCase() === "potion") {
                            console.log("Identified item key (pattern 5) [potion]")
                            let tryPotionEffect = match[2]

                            constructedData = {
                                ...constructedData,
                                item: {
                                    material: match[1],
                                    potionEffect: (constant_pottion_effects.find((el) => el === tryPotionEffect.toUpperCase()))
                                }
                            }
                        } else {
                            console.log("Identified item key (pattern 5) [leather]")
                            let tryColor = match[2]

                            constructedData = {
                                ...constructedData,
                                item: {
                                    material: match[1],
                                    leatherColor: (constant_leather_colors.find((el) => el === tryColor.toUpperCase()))
                                }
                            }
                        }
                        continue
                    }

                    match = item_pattern_6.exec(subParts[1])

                    if(match !== null) {
                        console.log("Identified item key (pattern 6)")
                        constructedData = {
                            ...constructedData,
                            item: {
                                material: match[1],
                                leatherRGB: {
                                    red: parseInt(match[2]),
                                    green: parseInt(match[3]),
                                    blue: parseInt(match[4])
                                }
                            }
                        }
                        continue
                    }

                    continue
                case "name":
                    constructedData = {
                        ...constructedData,
                        name: subParts[1]
                    }
                    continue
                case "lore":
                    let loreLines = subParts[1].split(",")
                    
                    constructedData = {
                        ...constructedData,
                        lore: loreLines
                    }
                    continue
                case "amount":
                    constructedData = {
                        ...constructedData,
                        amount: parseInt(subParts[1])
                    }
                    continue
                case "player":
                    constructedData = {
                        ...constructedData,
                        playerHead: subParts[1]
                    }
                    continue
                case "unbreakable-item":
                    constructedData = {
                        ...constructedData,
                        unbreakableItem: (subParts[1].toLowerCase() === "true" ? true : (subParts[1].toLowerCase() === "false" ? false : undefined))
                    }
                    continue
            }

            //intentar con un encantamiento
            let enchantmentAndLevel : EnchantmentAndLevel | undefined = undefined

            for(let enchantmentCheck of constant_enchantments) {
                if(enchantmentCheck === subParts[0].toLowerCase()) {
                    //ok, es un encantamiento
                    let level = parseInt(subParts[1])

                    enchantmentAndLevel = {
                        enchantment: enchantmentCheck as Enchantment,
                        level
                    }

                    break
                }
            }

            if(enchantmentAndLevel !== undefined) {
                if(constructedData.enchantments === undefined) {
                    constructedData = {
                        ...constructedData,
                        enchantments: [enchantmentAndLevel]
                    }
                } else {
                    constructedData = {
                        ...constructedData,
                        enchantments: [
                            ...constructedData.enchantments,
                            enchantmentAndLevel
                        ]
                    }
                }
            }
        } else if(subParts.length === 3) {
            console.log("TEEEEST => " + subParts[1] + ":" + subParts[2])
            let match = item_pattern_2.exec(subParts[1] + ":" + subParts[2])

            if(match !== null) {
                console.log("Identified item key (pattern 2)")
                constructedData = {
                    ...constructedData,
                    item: {
                        material: match[1],
                        durability: parseInt(match[2])
                    }
                }
            }
        } else if(subParts.length === 1) {
            //intentar con un flag de item
            let itemFlag : ItemFlag | undefined = undefined

            for(let flagCheck of constant_item_flags) {
                if(flagCheck === subParts[0].toUpperCase()) {
                    itemFlag = flagCheck as ItemFlag
                }
            }

            if(itemFlag !== undefined) {
                //ok es un flag de item
                if(constructedData.itemFlags === undefined) {
                    constructedData = {
                        ...constructedData,
                        itemFlags: [itemFlag]
                    }
                } else {
                    constructedData = {
                        ...constructedData,
                        itemFlags: [
                            ...constructedData.itemFlags,
                            itemFlag
                        ]
                    }
                }
            }
        }
    }

    if(constructedData.item.material !== "undefined") {
        //es valido
        return constructedData
    }

    return undefined
}