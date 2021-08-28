import { faBookOpen, faBox, faCog, faExclamationCircle, faInfo, faPen, faPlus, faSave, faSearch, faTag, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { constant_enchantments, Enchantment } from '../resources/app/Constants'
import { GetEnchantmentName, GetMaterialName } from '../resources/app/Language'
import { PrizeData } from '../resources/app/PrizeData'
import { PrizeItem, PrizeItemToString, StringToPrizeItem } from '../resources/app/PrizeItem'
import { GetItemByName, TranslatedMinecraftItem } from '../util/MinecraftItem'
import { formatColors } from '../util/MinecraftUtil'
import ItemSelect from './ItemSelect'
import ItemTooltip from './ItemTooltip'
import ItemTooltipFormat from './ItemTooltipFormat'
import PrizeItemEditor from './PrizeItemEditor'
import { useTranslation } from 'react-i18next'

interface Props {
    data?: {
        key: string,
        prize: PrizeData
    },
    enableGlobalLore: boolean,
    resultCallback: (newData: PrizeData) => void,
    cancellCallback: () => void
}

interface EnchantmentAndLevel {
    enchantment: Enchantment,
    level: number
}

function PrizeEditor(props: Props) {

    let {t} = useTranslation()

    let [currentTab, setCurrentTab] = React.useState<number>(1)
    let [hasUnsavedChanged, setHasUnsavedChanges] = React.useState<boolean>(false)

    let resolveDisplayLore = () : string[] | undefined => {
        if(props.enableGlobalLore) {
            return props.data?.prize.OriginalLore
        } else {
            return props.data?.prize.Lore
        }
    }

    //Conservar toda la información en su propio estado
    let [displayName, setDisplayName] = React.useState<string>(props.data?.prize.DisplayName ?? "")
    let [displayItem, setDisplayItem] = React.useState<string>(props.data?.prize.DisplayItem ?? "stone")
    let [displayAmount, setDisplayAmount] = React.useState<number>(props.data?.prize.DisplayAmount ?? 1)
    let [displayLore, setDisplayLore] = React.useState<string[]>(resolveDisplayLore() ?? [])
    let [maxRange, setMaxRange] = React.useState<number>(props.data?.prize.MaxRange ?? 100)
    let [chance, setMaxChance] = React.useState<number>(props.data?.prize.Chance ?? 30)
    let [firework, setFirework] = React.useState<boolean>(props.data?.prize.Firework ?? false)
    let [glowing, setGlowing] = React.useState<boolean>(props.data?.prize.Glowing ?? false)
    let [commands, setCommands] = React.useState<string[]>(props.data?.prize.Commands ?? [])
    let [messages, setMessages] = React.useState<string[]>(props.data?.prize.Messages ?? [])
    let [enchantments, setEnchantments] = React.useState<EnchantmentAndLevel[]>(props.data?.prize.DisplayEnchantments?.flatMap(
        (el) => {
            try {
                let split = el.split(":")
                if(split.length === 1) {
                    return {
                        enchantment: split[0].toLowerCase(),
                        level: 1
                    } as EnchantmentAndLevel
                } else {
                    return {
                        enchantment: split[0].toLowerCase(),
                        level: parseInt(split[1])
                    } as EnchantmentAndLevel
                }
            } catch(ex: any) {
                return {
                    enchantment: "unknown",
                    level: 1
                } as EnchantmentAndLevel
            }
        }
    ) ?? [])
    let [prizeItems, setPrizeItems] = React.useState<PrizeItem[]>(((props.data?.prize.Items ?? []).map((item) => StringToPrizeItem(item))).filter((item) => item !== undefined) as PrizeItem[])

    React.useEffect(() => {
        setCurrentTab(1)
        setHasUnsavedChanges(false)
    }, [props.data])

    let handleDisplayName = (newValue : string) => {
        setDisplayName(newValue)
        setHasUnsavedChanges(true)
    }

    let handleLore = (newValue : string) => {
        let lines = newValue.split(/\r?\n/)
        setDisplayLore(lines)
        setHasUnsavedChanges(true)
    }

    let handleDisplayAmount = (newValue : string) => {
        setDisplayAmount(parseInt(newValue))
        setHasUnsavedChanges(true)
    }
    
    let handleRange = (newValue : string) => {
        setMaxRange(parseInt(newValue))
        setHasUnsavedChanges(true)
    }
    
    let handleChance = (newValue : string) => {
        setMaxChance(parseInt(newValue))
        setHasUnsavedChanges(true)
    }

    let handleDisplayItem = (newValue : TranslatedMinecraftItem[]) => {
        if(newValue.length === 0) return

        setDisplayItem(newValue[0].name.toUpperCase())
        setHasUnsavedChanges(true)
    }

    let handleFireworkSelectChange = (newValue : string) => {
        setFirework(newValue === "true")
        setHasUnsavedChanges(true)
    }

    let handleGlowingSelectChange = (newValue : string) => {
        setGlowing(newValue === "true")
        setHasUnsavedChanges(true)
    }

    let handleSave = () => {

        let dataToSave = {
            DisplayName: displayName,
            DisplayItem: displayItem,
            DisplayAmount: displayAmount,
            MaxRange: maxRange,
            Chance: chance,
            Firework: firework,
            Glowing: glowing,
            Commands: commands,
            Messages: messages,
            DisplayEnchantments: enchantments.flatMap((el) => el.enchantment.toUpperCase() + ":" + el.level),
            Items: prizeItems.map((item) => PrizeItemToString(item))
        } as PrizeData

        if(props.data?.prize.OriginalLore !== undefined) {
            dataToSave.OriginalLore = displayLore
        } else {
            dataToSave.Lore = displayLore
        }

        if(hasUnsavedChanged) {
            props.resultCallback(dataToSave)
        }
    }

    let displayMaterial = GetItemByName(displayItem.toLowerCase() as any) ?? GetItemByName("stone")!!

    let handleCommandEdition = (index: number, newValue: string) => {
        commands[index] = newValue
        setCommands([...commands])
        setHasUnsavedChanges(true)
    }

    let handleCommandAdd = () => {
        setCommands([...commands, ""])
    }

    let handleCommandRemove = (index: number) => {
        let newCommands : string[] = []
        for(let i = 0; i < commands.length; i++) {
            if(i === index) continue
            newCommands.push(commands[i])
        }
        setCommands([...newCommands])
        setHasUnsavedChanges(true)
    }

    let handleMessageEdition = (newValue: string) => {
        let lines = newValue.split("\n")
        setMessages([...lines])
        setHasUnsavedChanges(true)
    }

    let handleEnchantmentAdd = () => {
        setEnchantments([...enchantments, {enchantment: "aqua_affinity", level: 1}])
        setHasUnsavedChanges(true)
    }

    let handleEnchantmentRemove = (index: number) => {
        let newEnchantments : EnchantmentAndLevel[] = []
        for(let i = 0; i < enchantments.length; i++) {
            if(i === index) continue
            newEnchantments.push(enchantments[i])
        }
        setEnchantments([...newEnchantments])
        setHasUnsavedChanges(true)
    }

    let handleEnchantmentLevelChange = (index: number, newValue: number) => {
        setHasUnsavedChanges(true)
        enchantments[index].level = newValue
        setEnchantments([...enchantments])
    }

    let handleEnchantmentTypeChange = (index: number, newValue: string) => {
        setHasUnsavedChanges(true)
        enchantments[index].enchantment = newValue as Enchantment
        setEnchantments([...enchantments])
    }

    let material = GetItemByName(displayItem as any)
    let materialName = (material === undefined ? t("unknown_material") : (GetMaterialName(material.name) ?? material.label))

    let handleAddPrizeItem = () => {
        setHasUnsavedChanges(true)
        setPrizeItems([
            {
                item: {
                    material: "stone"
                }
            },
            ...prizeItems
        ])
    }

    let handleRemovePrizeItem = (index : number) => {
        let newArray : PrizeItem[] = []

        for(let i = 0; i < prizeItems.length; i++) {
            if(i === index) continue
            newArray.push(prizeItems[i])
        }

        setHasUnsavedChanges(true)

        setPrizeItems([...newArray])
    }

    let handlePrizeUpdate = (index: number, newData: PrizeItem) => {
        setHasUnsavedChanges(true)

        let newArray : PrizeItem[] = []

        for(let i = 0; i < prizeItems.length; i++) {
            if(i === index) {
                newArray.push(newData)
            } else {
                newArray.push(prizeItems[i])
            }
        }

        setPrizeItems([...newArray])
    }

    let allEnchantments : Enchantment[] = []
    for(let enchant of constant_enchantments) {
        allEnchantments.push(enchant)
    }
    let sortedEnchantmentsByName = allEnchantments.sort((a,b) => GetEnchantmentName(a as Enchantment).localeCompare(GetEnchantmentName(b as Enchantment)))

    return (
        <div className={"fmodal-background "}>
            <div className="container mt-2 mb-5 bg-body p-4 border border-dark rounded">
                <div className="d-flex justify-content-between align-items-center">
                    {
                        props.data !== undefined
                        ?
                            <h5>{t("edit_prize_modal_title")} "{props.data!!.key}"</h5>
                        :   <h5>{t("create_prize_modal_title")}</h5>
                    }
                    <div>
                        <span className={"btn btn-primary mr-2" + (hasUnsavedChanged ? "" : " disabled")} onClick={() => handleSave()}>
                            <FontAwesomeIcon icon={props.data !== undefined ? faSave : faPlus} /> {props.data !== undefined ? t("save_button") : t("create_button")}
                        </span>
                        <span className="btn btn-danger" onClick={() => props.cancellCallback()}><FontAwesomeIcon icon={faTimes} /> {t("cancel_button")}</span>
                    </div>
                </div>
                <ul className="nav nav-tabs mt-4">
                    <li className="nav-item" style={{cursor: "pointer"}}>
                        <span onClick={() => setCurrentTab(1)} className={"nav-link" + (currentTab === 1 ? " active" : "")} aria-current="page"><span className="icon-minecraft icon-minecraft-item-frame mr-1" /> {t("general_tab")}</span>
                    </li>
                    <li className="nav-item" style={{cursor: "pointer"}}>
                        <span onClick={() => setCurrentTab(2)} className={"nav-link" + (currentTab === 2 ? " active" : "")}><span className="icon-minecraft icon-minecraft-enchanted-book mr-1" /> {t("enchantments_tab")}</span>
                    </li>
                    <li className="nav-item" style={{cursor: "pointer"}}>
                        <span onClick={() => setCurrentTab(3)} className={"nav-link" + (currentTab === 3 ? " active" : "")}><span className="icon-minecraft icon-minecraft-command-block mr-1" /> {t("commands_tab")}</span>
                    </li>
                    <li className="nav-item" style={{cursor: "pointer"}}>
                        <span onClick={() => setCurrentTab(4)} className={"nav-link" + (currentTab === 4 ? " active" : "")}><span className="icon-minecraft icon-minecraft-chain-command-block mr-1" /> {t("messages_tab")}</span>
                    </li>
                    <li className="nav-item" style={{cursor: "pointer"}}>
                        <span onClick={() => setCurrentTab(5)} className={"nav-link" + (currentTab === 5 ? " active" : "")}><span className="icon-minecraft icon-minecraft-chest mr-1" /> {t("items_tab")}</span>
                    </li>
                </ul>
                <div className={"p-4 border border-top-0 border-dark" + (currentTab !== 1 ? " d-none" : "")}>
                    <div className="mb-4">
                        <label htmlFor="input-display-name" className="form-label font-weight-bold"><FontAwesomeIcon icon={faTag} /> {t("edit_prize_name_to_display")}</label>
                        <input placeholder={materialName} value={displayName} onChange={(e) => handleDisplayName(e.target.value)} type="text" id="input-display-name" className="form-control" aria-describedby="displayNameHelpBlock" />
                        <div id="displayNameHelpBlock" className="form-text">
                            {t("edit_prize_name_to_display_description")}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="input-display-material" className="form-label font-weight-bold"><FontAwesomeIcon icon={faBookOpen} /> {t("edit_prize_material_to_display")}</label>
                        <div className="d-flex flex-workarount">
                            <span className={"icon-minecraft mr-3 " + displayMaterial?.css} />
                            <ItemSelect 
                                values={[displayMaterial]}
                                onChange={(values) => handleDisplayItem(values)}
                            />
                        </div>
                        <div id="displayItemHelpBlock" className="form-text">
                            {t("edit_prize_material_to_display_description")}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="input-display-amount" className="form-label font-weight-bold"><FontAwesomeIcon icon={faBox} /> {t("edit_prize_amount_to_display")}</label>
                        <input onChange={(e) => handleDisplayAmount(e.target.value)} value={displayAmount} type="number" id="input-display-amount" className="form-control" aria-describedby="displayAmountHelpBlock" min={1} max={64} />
                        <div id="displayAmountHelpBlock" className="form-text">
                            {t("edit_prize_amount_to_display_description")}
                        </div>
                    </div>
                    <div className="mb-4 row g-0">
                        <div className="col-6">
                            <label htmlFor="input-display-lore" className="form-label font-weight-bold"><FontAwesomeIcon icon={faPen} /> {t("edit_prize_lore")}</label>
                            <textarea onChange={(e) => handleLore(e.target.value)} id="input-display-lore" className="form-control" aria-describedby="displayLoreHelpBlock" value={displayLore.join("\n")} placeholder={t("edit_prize_lore_placeholder")} />
                            <div id="displayLoreHelpBlock" className="form-text">
                                {t("edit_prize_lore_description")}
                            </div>
                        </div>
                        <div className="col-5 offset-1">
                            <div className="font-weight-bold"><FontAwesomeIcon icon={faSearch} /> {t("edit_prize_lore_preview")}</div>
                            <ItemTooltip>
                                <ItemTooltipFormat title={displayName.length === 0 ? materialName : displayName}>
                                    { displayLore.length > 1 || (displayLore.length === 1 && displayLore[0].length !== 0)
                                    ?
                                        displayLore.map((line) => {
                                            return (
                                                <>
                                                    {"&5&o" + line}<br/>
                                                </>
                                            )
                                        })
                                    : undefined
                                    }
                                </ItemTooltipFormat>
                            </ItemTooltip>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="input-range" className="form-label font-weight-bold"><FontAwesomeIcon icon={faCog} /> {t("edit_prize_range")}</label>
                        <input onChange={(e) => handleRange(e.target.value)} value={maxRange} type="number" id="input-range" className="form-control" aria-describedby="rangeHelpBlock" min={1} />
                        <div id="rangeHelpBlock" className="form-text">
                            {t("edit_prize_range_description")}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="input-chance" className="form-label font-weight-bold"><FontAwesomeIcon icon={faCog} /> {t("edit_prize_chance")}</label>
                        <input onChange={(e) => handleChance(e.target.value)} value={chance} type="number" id="input-chance" className="form-control" aria-describedby="chanceHelpBlock" min={1} />
                        <div id="chanceHelpBlock" className="form-text">
                            {t("edit_prize_chance_description")}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="input-firework" className="form- font-weight-bold"><FontAwesomeIcon icon={faCog} /> {t("edit_prize_firework")}</label>
                        <select defaultValue={firework ? "true" : "false"} className="form-control" id="input-firework" aria-describedby="fireworkHelpBlock" onChange={(e) => handleFireworkSelectChange(e.target.value)}>
                            <option value="true">{t("select_op_yes")}</option>
                            <option value="false">{t("select_op_no")}</option>
                        </select>
                        <div id="fireworkHelpBlock" className="form-text">
                            {t("edit_prize_firework_description")}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="input-glowing" className="form-label font-weight-bold"><FontAwesomeIcon icon={faCog} /> {t("edit_prize_glow_effect")}</label>
                        <select defaultValue={glowing ? "true" : "false"} className="form-control" id="input-glowing" aria-describedby="glowingHelpBlock" onChange={(e) => handleGlowingSelectChange(e.target.value)}>
                            <option value="true">{t("select_op_yes")}</option>
                            <option value="false">{t("select_op_no")}</option>
                        </select>
                        <div id="glowingHelpBlock" className="form-text">
                            {t("edit_prize_glow_effect_description")}
                        </div>
                    </div>
                </div>
                <div className={"p-4 border border-top-0 border-dark" + (currentTab !== 2 ? " d-none" : "")}>
                    {
                        enchantments.length === 0
                        ?
                            <div className="p-3 bg-warning border border-warning"><FontAwesomeIcon icon={faExclamationCircle} /> {t("edit_prize_no_enchantments_configured")}</div>
                        :
                        <div className="border border-secondary bg-secondary p-3 mb-3">
                            <FontAwesomeIcon icon={faInfo} /> {t("edit_prize_enchantments_description")}
                        </div>
                    }
                    {
                        enchantments.map((enchantmentInfo, index) => {
                            return (
                                <div className="input-group mb-2" key={index}>
                                    <div className="input-group-preppend">
                                        <input type="number" step={1} min={1} value={enchantmentInfo.level} className="form-control" onChange={(e) => handleEnchantmentLevelChange(index, parseInt(e.target.value))} />
                                    </div>
                                    <select className="form-control" value={enchantmentInfo.enchantment} onChange={(e) => handleEnchantmentTypeChange(index, e.target.value)}>
                                        {sortedEnchantmentsByName.map(constant => {
                                            return (
                                                <option value={constant}>{GetEnchantmentName(constant)}</option>
                                            )
                                        })}
                                    </select>
                                    <div className="input-group-append">
                                        <button className="btn btn-danger" type="button" onClick={() => handleEnchantmentRemove(index)}><FontAwesomeIcon icon={faTrash} /> {t("button_delete")}</button>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className="text-left mt-3">
                        <span className="btn btn-success" onClick={() => handleEnchantmentAdd()}><FontAwesomeIcon icon={faPlus} /> {t("button_new_enchantment")}</span>
                    </div>
                </div>
                <div className={"p-4 border border-top-0 border-dark" + (currentTab !== 3 ? " d-none" : "")}>
                    {
                        commands.length === 0
                        ?
                            <div className="p-3 bg-warning border border-warning"><FontAwesomeIcon icon={faExclamationCircle} /> {t("edit_prize_no_commands_configured")}</div>
                        : undefined
                    }
                    {
                        commands.map((command, index) => {
                            return (
                                <div className="input-group mb-2" key={index}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">/</span>
                                    </div>
                                    <input type="text" className="form-control" placeholder={t("edit_prize_commands_input_placeholder")} aria-label="Username" aria-describedby="basic-addon1" value={command} onChange={(e) => handleCommandEdition(index, e.target.value)} />
                                    <div className="input-group-append">
                                        <button className="btn btn-danger" type="button" onClick={() => handleCommandRemove(index)}><FontAwesomeIcon icon={faTrash} /> {t("button_delete")}</button>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className="text-left mt-3">
                        <span className="btn btn-success" onClick={() => handleCommandAdd()}><FontAwesomeIcon icon={faPlus} /> {t("button_new_command")}</span>
                    </div>
                </div>
                <div className={"p-4 border border-top-0 border-dark" + (currentTab !== 4 ? " d-none" : "")}>
                    <b>{t("edit_prize_messages_to_display")}</b><br/>
                    <textarea rows={4} className="form-control mb-2 mt-1" placeholder={t("edit_prize_messages_input_placeholder")} value={messages.join("\n")} onChange={(e) => handleMessageEdition(e.target.value)} />
                    <div className="border border-secondary bg-secondary p-3 mb-3">
                        <FontAwesomeIcon icon={faInfo} /> {t("edit_prize_messages_description")}
                    </div>
                    <hr />
                    <b>{t("edit_prize_messages_preview")}</b><br/>
                    {
                        messages.length === 0 || (messages.length === 1 && messages[0].length === 0)
                        ?
                            <div className="p-3 bg-warning border border-warning"><FontAwesomeIcon icon={faExclamationCircle} /> {t("edit_prize_messages_should_configure_a_message")}</div>
                        :
                        <div className="minecraft-chat-preview mt-1">
                            
                            {
                                messages.map((message, index) => {
                                    return (
                                        <>{formatColors(message)}<br/></>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
                <div className={"p-4 border border-top-0 border-dark" + (currentTab !== 5 ? " d-none" : "")}>
                    <div className="border border-secondary bg-secondary p-3 mb-3">
                        <FontAwesomeIcon icon={faInfo} /> {t("edit_prize_items_description")}
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <b>{t("edit_prize_items_to_give")}</b>
                        <span className="btn btn-success" onClick={handleAddPrizeItem}><FontAwesomeIcon icon={faPlus} /> {t("button_new_item")}</span>
                    </div>
                    <div className="mt-2">
                        {
                            prizeItems.length === 0
                            ?
                                <div className="bg-warning p-3 border border-warning">
                                    <FontAwesomeIcon icon={faExclamationCircle} /> {t("edit_prize_no_items_configured")}
                                </div>
                            : prizeItems.map((element, index) => {

                                return (
                                    <PrizeItemEditor 
                                        prizeItem={element} 
                                        key={index} 
                                        onChange={(data) => handlePrizeUpdate(index, data)}
                                        onDelete={() => handleRemovePrizeItem(index)}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrizeEditor
