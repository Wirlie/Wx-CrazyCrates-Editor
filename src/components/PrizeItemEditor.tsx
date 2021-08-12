import { faAirFreshener, faBook, faBookMedical, faCalculator, faChevronDown, faChevronRight, faCog, faEdit, faFlask, faHashtag, faPen, faPencilAlt, faTag, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { CSSProperties } from 'react'
import { EnchantmentAndLevel, ItemFlag } from '../resources/app/Constants'
import { buildOption, buildOptionLore, buildOptionToggle, buildOptionTooltip } from '../resources/app/EditorUtil'
import { GetMaterialName } from '../resources/app/Language'
import { PrizeItem } from '../resources/app/PrizeItem'
import { GetItemByName, TranslatedMinecraftItem } from '../util/MinecraftItem'
import PrizeItemAmountRow from './prize_item_editor/PrizeItemAmountRow'
import PrizeItemDurabilityRow from './prize_item_editor/PrizeItemDurabilityRow'
import PrizeItemEnchantmentsRow from './prize_item_editor/PrizeItemEnchantmentsRow'
import PrizeItemFlagsRow from './prize_item_editor/PrizeItemFlagsRow'
import PrizeItemHeadRow from './prize_item_editor/PrizeItemHeadRow'
import PrizeItemLeatherColorRow from './prize_item_editor/PrizeItemLeatherColorRow'
import PrizeItemLoreRow from './prize_item_editor/PrizeItemLoreRow'
import PrizeItemMaterialRow from './prize_item_editor/PrizeItemMaterialRow'
import PrizeItemNameRow from './prize_item_editor/PrizeItemNameRow'
import PrizeItemPotionEffectRow from './prize_item_editor/PrizeItemPotionEffectRow'
import PrizeItemUnbreakeableRow from './prize_item_editor/PrizeItemUnbreakeableRow'

interface Props {
    prizeItem: PrizeItem,
    onChange(newData: PrizeItem) : void,
    onDelete() : void
}

function PrizeItemEditor(props: Props) {
    const {
        prizeItem
    } = props

    let [expanded, setExpanded] = React.useState<boolean>(false)

    let itemMaterial = GetItemByName(prizeItem.item.material as any) ?? GetItemByName("stone")!!
    let itemName = prizeItem.name ?? GetMaterialName(prizeItem.item.material) ?? itemMaterial.label

    let canPotionEffectDefined = itemMaterial.name === "potion" || itemMaterial.name === "lingering_potion" || itemMaterial.name === "splash_potion"
    let canLeatherColorDefined = itemMaterial.name === "leather_boots" || itemMaterial.name === "leather_helmet" || itemMaterial.name === "leather_horse_armor" || itemMaterial.name === "leather_leggings" || itemMaterial.name === "leather_chestplate"
    let canPlayerHeadDefined = itemMaterial.name === "player_head"

    let itemAmount = prizeItem.amount ?? 1

    let handleMaterialRowChange = (values : TranslatedMinecraftItem[]) => {
        if(values.length !== 0) {
            props.onChange({
                ...prizeItem,
                item: {
                    ...prizeItem.item,
                    material: values[0].name
                }
            })
        }
    }

    let handleAmountRowChange = (amount : number) => {
        props.onChange({
            ...prizeItem,
            amount
        })
    }

    let handleNameRowChange = (value : string | undefined) => {
        props.onChange({
            ...prizeItem,
            name: value
        })
    }

    let handleDurabilityRowChange = (value : number | undefined) => {
        props.onChange({
            ...prizeItem,
            item: {
                ...prizeItem.item,
                durability: value
            }
        })
    }

    let handleLoreRowChange = (value : string[] | undefined) => {
        props.onChange({
            ...prizeItem,
            lore: value
        })
    }

    let handleUnbreakableRowChange = (value : boolean | undefined) => {
        props.onChange({
            ...prizeItem,
            unbreakableItem: value
        })
    }

    let handleEnchantmentsRowChange = (value : EnchantmentAndLevel[] | undefined) => {
        props.onChange({
            ...prizeItem,
            enchantments: value
        })
    }

    let handleItemFlagsRowChange = (value : ItemFlag[] | undefined) => {
        props.onChange({
            ...prizeItem,
            itemFlags: value
        })
    }

    return (
        <div className="border border-dark mb-3 p-3 bg-dark">
            <div className={"d-flex align-items-center justify-content-between" + (expanded ? " mb-3" : "")}>
                <div>
                    <FontAwesomeIcon icon={expanded ? faChevronDown : faChevronRight} className="mr-3 cursor-pointer" size="lg" onClick={() => setExpanded(!expanded)} /> 
                    <span className={"icon-minecraft mr-2 " + itemMaterial.css} /> <b>{buildOptionTooltip(itemName)}</b>
                </div>
                <div>
                    <span className="btn btn-danger btn-sm" onClick={() => props.onDelete()}><FontAwesomeIcon icon={faTrash} /> Borrar</span>
                </div>
            </div>
            <table className={"table table-dark m-0 border border-dark" + (expanded ? "" : " d-none")}>
                <tbody>
                    <PrizeItemMaterialRow 
                        material={itemMaterial} 
                        onChange={handleMaterialRowChange}
                    />
                    <PrizeItemDurabilityRow 
                        durability={prizeItem.item.durability}
                        onChange={handleDurabilityRowChange}
                    />
                    <PrizeItemLeatherColorRow display={canLeatherColorDefined} />
                    <PrizeItemPotionEffectRow display={canPotionEffectDefined} />
                    <PrizeItemHeadRow display={canPlayerHeadDefined} />
                    <PrizeItemAmountRow 
                        amount={itemAmount}
                        onChange={handleAmountRowChange}
                    />
                    <PrizeItemNameRow 
                        itemName={prizeItem.name}
                        onChange={handleNameRowChange}
                    />
                    <PrizeItemLoreRow 
                        lore={prizeItem.lore}
                        onChange={handleLoreRowChange}
                    />
                    <PrizeItemUnbreakeableRow 
                        unbreakeable={prizeItem.unbreakableItem}
                        onChange={handleUnbreakableRowChange}
                    />
                    <PrizeItemEnchantmentsRow
                        enchantments={prizeItem.enchantments}
                        onChange={handleEnchantmentsRowChange}
                    />
                    <PrizeItemFlagsRow
                        flags={prizeItem.itemFlags}
                        onChange={handleItemFlagsRowChange}
                    />
                </tbody>
            </table>
        </div>
    )
}

export default PrizeItemEditor
