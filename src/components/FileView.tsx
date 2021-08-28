import React from 'react'
import { FileInfo } from './FileExplorer'
import fs from 'fs'
import YAML from 'yaml'
import { YAMLSemanticError } from 'yaml/util'
import { GetItemByName } from '../util/MinecraftItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faAtom, faCog, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import ChestInventory, { SlotData } from './ChestInventory'
import ItemTooltipFormat from './ItemTooltipFormat'
import PrizeEditor from './PrizeEditor'
import { PrizeData } from '../resources/app/PrizeData'
import Modal from './modal/Modal'
import CCrate from '../resources/app/CCrate'
import MonacoEditor from 'react-monaco-editor';
import GeneralTab from './fileview/tabs/GeneralTab'
import SpecialTab from './fileview/tabs/SpecialTab'
import { GetMaterialName } from '../resources/app/Language'
import { useTranslation } from 'react-i18next'

export let parsePlaceholders = (lore: string[], data: PrizeData) : string[] => {
    let newArray = []
    for(let loreLine of lore) {
        newArray.push(loreLine.replace("{Chance}", "" + (data.Chance ?? 0)).replace("{DisplayName}", (data.DisplayName ?? "")).replace("{DisplayAmount}", "" + (data.DisplayAmount ?? 1)).replace("{CommandCount}", "" + (data.Commands?.length ?? 0)))
    }
    return newArray
}

interface Props {
    active: boolean,
    file: FileInfo
}

function FileView(props: Props) {

    let mainEditorRef = React.useRef<any>(undefined)

    let [makingPrize, setMakingPrize] = React.useState<boolean>(false)
    let [editingPrizeKey, setEditingPrizeKey] = React.useState<string|undefined>(undefined)
    let [parsingData, setParsingData] = React.useState<boolean>(true)
    let [errorMessage, setErrorMessage] = React.useState<string>("")
    let [activeTab, setActiveTab] = React.useState<number>(1)
    let [rawData, setRawData] = React.useState<string|undefined>(undefined)
    let [data, setData] = React.useState<CCrate|undefined>(undefined)
    let [monoData, setMonoData] = React.useState<string>("")
    let [saveFromMonoData, setSaveFromMonoData] = React.useState<boolean>(false)
    let [removePrizeKey, setRemovePrizeKey] = React.useState<string|undefined>(undefined)
    let [warnRemoveAllPrizeKey, setWarnRemoveAllPrizeKey] = React.useState<boolean>(false)
    let [selectedChestInventorySlot, setSelectedChestInventorySlot] = React.useState<SlotData|undefined>(undefined)
    let [recalculatePrizesArray, setRecalculatePrizesArray] = React.useState<{ [key: string]: PrizeData } | undefined>(undefined)

    let {t} = useTranslation()

    const {
        active,
        file
    } = props

    const doParseFile = React.useCallback(() => {
        setErrorMessage("")

        if(!file.name.endsWith(".yml")) {
            setParsingData(false)
            setErrorMessage(t("unsuported_file_extension"))
            return
        }

        fs.readFile(file.fullPath, (error, data) => {
            if(error != null) {
                setParsingData(false)
                setErrorMessage(t("internal_error_reading_file"))
                return
            }

            let rawData = data.toString('utf8')
            setRawData(rawData)
            setMonoData("")
            setParsingData(false)

            try {
                let parsed = YAML.parse(data.toString('utf8'))
                
                if(parsed["Crate"] === undefined) {
                    setErrorMessage(t("file_is_not_a_cc_file"))
                    setActiveTab(4) //como se va a el archivo manualmente, si el usuario lo corrige, la pestaña activa será la pestaña de edición manual (numero 3)
                    return
                }

                let preData = parsed["Crate"] as CCrate

                if(preData.PhysicalKey === undefined || preData.PhysicalKey === null) {
                    preData.PhysicalKey = {
                        Glowing: undefined,
                        Item: undefined,
                        Lore: undefined,
                        Name: undefined
                    }
                }

                if(preData.Hologram === undefined || preData.Hologram === null) {
                    preData.Hologram = {
                        Height: undefined,
                        Message: undefined,
                        Toggle: undefined
                    }
                }

                if(preData.Prizes === undefined || preData.Prizes === null) {
                    preData.Prizes = {}
                }

                if(preData.CCEditorConfig === undefined || preData.CCEditorConfig === null) {
                    preData.CCEditorConfig = {
                        GlobalLore: undefined,
                        UseGlobalLore: undefined
                    }
                } 
                
                setData(preData)
                console.log("DO PARSE INTERNAL AND RECALCULATE")
                setRecalculatePrizesArray(preData.Prizes)
            } catch(ex: any) {
                console.log(ex)

                if(ex instanceof YAMLSemanticError) {
                    let error = ex as YAMLSemanticError
                    error.makePretty()

                    setErrorMessage(t("file_parse_error"))
                } else {
                    setErrorMessage(t("unexpected_error_while_parsing"))
                }
            }
        })
    }, [file.fullPath, file.name, t])

    let updateGlobalLores = React.useCallback(() => {
        let newGlobalLore = data?.CCEditorConfig?.GlobalLore ?? []

        if(data?.CCEditorConfig?.UseGlobalLore === true) {
            let prizes = data!!.Prizes ?? {}
            let prizesKeys = Object.keys(prizes)

            for(let prizeKey of prizesKeys) {
                let originalLore = data!!.Prizes!![prizeKey].OriginalLore ?? []
    
                if(originalLore.length === 1 && originalLore[0].length === 0) {
                    originalLore = [] //No agregar el lore vacío.
                }

                data!!.Prizes!![prizeKey] = {
                    ...data!!.Prizes!![prizeKey],
                    Lore: [
                        ...parsePlaceholders(newGlobalLore, data!!.Prizes!![prizeKey]),
                        ...originalLore
                    ]
                }
            }
        }
    }, [data])

    let doSaveDataWithoutRecalculation = React.useCallback(() => {
        updateGlobalLores()

        let dataParsed = {"Crate": data} //Fix, ya que la key "Crate" lo eliminamos al procesar los datos del YAML
        let newRawData = YAML.stringify(dataParsed)
       
        let destination = file.fullPath

        try {
            fs.writeFileSync(destination, newRawData)

            if(saveFromMonoData) {
                setData(undefined)
                setMonoData("")
                setSaveFromMonoData(false)
                doParseFile()
            }
        } catch(ex: any) {
            console.log(ex)
            setErrorMessage(t("save_file_error"))
        }

        setRawData(newRawData)
        mainEditorRef.current?.setValue(newRawData)
        setMonoData("")
    }, [data, saveFromMonoData, doParseFile, file.fullPath, updateGlobalLores, t])

    let doSaveRaw = (data: string) => {
        let destination = file.fullPath

        try {
            fs.writeFileSync(destination, data)

            if(monoData.length > 0) {
                setData(undefined)
                setMonoData("")
                doParseFile()
            }
        } catch(ex: any) {
            console.log(ex)
            setErrorMessage(t("save_file_error"))
        }
    }

    React.useEffect(() => {
        console.log("DO PARSE")
        doParseFile()
    }, [file, doParseFile])

    let prizes = React.useMemo(() => data?.Prizes ?? {}, [data?.Prizes])
    let slotData = React.useRef<SlotData[]>([])

    let recalculateSlotData = React.useCallback(() => {
        if(recalculatePrizesArray === undefined) return

        console.log("RECALCULATE: ")
        console.log(recalculatePrizesArray)

        let prizesKeys = Object.keys(recalculatePrizesArray) as Array<any>
        slotData.current = []
        
        let rawIndex = 0
        let newPrizesArray : {
            [key: string]: PrizeData;
        } = {}
        let doSave = false

        for(let prizeKey of prizesKeys) {
            let newPrizeKey = "item" + rawIndex
            let nameKey = (recalculatePrizesArray[prizeKey].DisplayItem ?? "stone").toLowerCase()
            let lore = [...recalculatePrizesArray[prizeKey].Lore ?? []]
            let displayItemDefined = recalculatePrizesArray[prizeKey].DisplayItem
            let displayNameDefined = recalculatePrizesArray[prizeKey].DisplayName
            newPrizesArray[newPrizeKey] = recalculatePrizesArray[prizeKey]

            if(newPrizeKey !== prizeKey) {
                doSave = true
            }
    
            if(GetItemByName(nameKey as any) === undefined) {
                lore.push("")
                lore.push(t("unknown_material_lore_0"))
                lore.push(t("unknown_material_lore_1"))
                lore.push("  &f" + nameKey)
            }
    
            slotData.current.push({
                rawIndex: rawIndex,
                makeLore: () => {
                    let displayName = displayNameDefined

                    if(displayName === undefined || displayName.length === 0) {
                        let materialName = displayItemDefined ?? "stone"
                        let material = GetItemByName(materialName as any)
        
                        if(material === undefined) {
                            displayName = t("unknown_material") ?? "Unknown Material"
                        } else {
                            displayName = (GetMaterialName(material.name) ?? material.label)
                        }
                    }

                    return (
                        <ItemTooltipFormat title={displayName}>
                            {lore.map((line, index) => {
                                return (
                                    <div key={index}>
                                        {line}<br/>
                                    </div>
                                )
                            })}
                        </ItemTooltipFormat>
                    )
                },
                item: GetItemByName(nameKey as any) ?? GetItemByName("air"),
                extra: newPrizeKey,
                amount: recalculatePrizesArray[prizeKey].DisplayAmount ?? 1
            })
            rawIndex++
        }

        setRecalculatePrizesArray(undefined)

        if(doSave) {
            console.log("FIXING PRIZES => " + newPrizesArray)
            data!!.Prizes = newPrizesArray
            doSaveDataWithoutRecalculation()
        }
    }, [data, doSaveDataWithoutRecalculation, recalculatePrizesArray, t])
    
    React.useEffect(() => {
        recalculateSlotData()
    }, [recalculatePrizesArray, recalculateSlotData])

    let doSaveData = React.useCallback(() => {
        doSaveDataWithoutRecalculation()
        setRecalculatePrizesArray(data?.Prizes ?? {})
    }, [doSaveDataWithoutRecalculation, data?.Prizes])

    let editingPrizeData : PrizeData | undefined = undefined

    if(data !== undefined && editingPrizeKey !== undefined) {
        editingPrizeData = prizes[editingPrizeKey]
    }

    let handleEditorValueChange = (data: string) => {
        if(data === rawData) {
            setMonoData("")
            setSaveFromMonoData(false)
        } else {
            setMonoData(data)
            setSaveFromMonoData(true)
        }
    }

    let handlePrizeEditorResult = (result: PrizeData) => {
        if(editingPrizeKey !== undefined) {
            //modo edición
            data!!.Prizes!![editingPrizeKey] = result
            setData(data)
            setEditingPrizeKey(undefined)
            doSaveData()
        } else if(makingPrize) {
            //modo creación
            let nextIndex = (slotData.current.length === 0 ? 0 : slotData.current[slotData.current.length - 1].rawIndex + 1)
            data!!.Prizes!!["item" + nextIndex] = result
            setData(data)
            setMakingPrize(false)
            doSaveData()
        }
    }

    let handleRemovePrizeConfirmationClick = () => {
        if(removePrizeKey !== undefined) {
            delete data!!.Prizes!![removePrizeKey]
            //recalcular indices
            setData(data)
            setEditingPrizeKey(undefined)
            setSelectedChestInventorySlot(undefined)
            doSaveData()
        }

        setRemovePrizeKey("cceditor:notification:success")
    }

    let handleAddPrizeClick = () => {
        //agregar...
        setMakingPrize(true)
    }

    let handleRemoveAllPrizesClick = () => {
        data!!.Prizes = {}
        doSaveData()
        setWarnRemoveAllPrizeKey(false)
    }

    return (
        <div className={"file-view h-100 " + (!active ? "d-none" : "")}>
            <Modal 
                open={warnRemoveAllPrizeKey} 
                title={t("delete_all_rewards_modal_title")}
                buttonRender={
                    <>
                        <span className="btn btn-secondary mr-1" onClick={() => setWarnRemoveAllPrizeKey(false)}><FontAwesomeIcon icon={faArrowLeft} /> {t("cancel_button")}</span>
                        <span className="btn btn-danger" onClick={() => handleRemoveAllPrizesClick()}><FontAwesomeIcon icon={faTrash} /> {t("delete_button")}</span>
                    </>
                }
            >
                {t("delete_reward_cannot_be_undone")}
            </Modal>
            <Modal 
                open={removePrizeKey !== undefined && removePrizeKey !== "cceditor:notification:success"} 
                title={t("are_sure_to_remove_reward")}
                buttonRender={
                    <>
                        <span className="btn btn-secondary mr-1" onClick={() => setRemovePrizeKey(undefined)}><FontAwesomeIcon icon={faArrowLeft} /> {t("cancel_button")}</span>
                        <span className="btn btn-danger" onClick={() => handleRemovePrizeConfirmationClick()}><FontAwesomeIcon icon={faTrash} /> {t("delete_button")}</span>
                    </>
                }
            >
                {t("delete_reward_cannot_be_undone")}
            </Modal>
            <Modal
                open={removePrizeKey === "cceditor:notification:success"}
                title={t("reward_deleted")}
                defaultCallback={() => setRemovePrizeKey(undefined)}
            >
                {t("reward_deleted_succesfully")}
            </Modal>
            {
                errorMessage.length > 0
                ? 
                <div className="bg-danger p-2 border-dark border">
                    {errorMessage}
                </div>
                : undefined
            }
            {
                monoData.length > 0
                ? 
                <div className="bg-info p-2 d-flex justify-content-between align-items-center">
                    {t("content_edited_manual")}
                    <span className="btn btn-light" onClick={() => doSaveRaw(monoData)}>{t("save_and_refresh_button")}</span>
                </div>
                : undefined
            }
            {
                data !== undefined
                ?
                    <>
                        {makingPrize
                        ? <PrizeEditor 
                            resultCallback={(result) => handlePrizeEditorResult(result)}
                            cancellCallback={() => setMakingPrize(false)}
                            enableGlobalLore={data?.CCEditorConfig?.UseGlobalLore ?? false}
                        />
                        : undefined
                        }
                        {editingPrizeData !== undefined && !makingPrize
                        ? <PrizeEditor 
                            data={{
                                key: editingPrizeKey!!,
                                prize: editingPrizeData
                            }}
                            resultCallback={(result) => handlePrizeEditorResult(result)}
                            cancellCallback={() => setEditingPrizeKey(undefined)}
                            enableGlobalLore={data?.CCEditorConfig?.UseGlobalLore ?? false}
                        />
                        : undefined
                        }
                        <ul className="nav nav-tabs mt-3 mr-3 ml-2">
                            <li className="nav-item pointer">
                                <span className={"nav-link border-bottom-0 " + (activeTab === 1 ? "active bg-secondary" : "")} onClick={() => setActiveTab(1)}><FontAwesomeIcon icon={faCog} /> {t("general_tab")}</span>
                            </li>
                            <li className="nav-item pointer">
                                <span className={"nav-link border-bottom-0 " + (activeTab === 2 ? "active bg-secondary" : "")} onClick={() => setActiveTab(2)}><FontAwesomeIcon icon={faCog} /> {t("content_tab")}</span>
                            </li>
                            <li className="nav-item pointer">
                                <span className={"nav-link border-bottom-0 " + (activeTab === 3 ? "active bg-secondary" : "")} onClick={() => setActiveTab(3)}><FontAwesomeIcon icon={faAtom} /> {t("special_tab")}</span>
                            </li>
                            <li className="nav-item pointer">
                                <span className={"nav-link border-bottom-0 " + (activeTab === 4 ? "active bg-secondary" : "")} onClick={() => setActiveTab(4)}><FontAwesomeIcon icon={faEdit} /> {t("manual_edit_tab")}</span>
                            </li>
                        </ul>
                        <GeneralTab
                            crateData={data}
                            displayTab={activeTab === 1}
                            onDataUpdate={() => doSaveData()}
                        />
                        <SpecialTab
                            crateData={data}
                            displayTab={activeTab === 3}
                            onDataUpdate={() => doSaveData()}
                        />
                        <div className="row m-0 p-0 mr-3 ml-2 pt-3 pb-3 pl-2 pr-2 border border-dark mb-5 border-top-0 bg-secondary" style={{display: (activeTab === 2 ? "block" : "none")}}>
                            <ChestInventory 
                                rows={12}
                                onOpenRewardEditor={(_index, _event, data) => {
                                    let prizeKey = data.extra as string
                                    setEditingPrizeKey(prizeKey)
                                }}
                                onRewardRemove={(_index, data) => {
                                    let prizeKey = data.extra as string
                                    setRemovePrizeKey(prizeKey)
                                }}
                                onSelectSlot={(data) => {
                                    setSelectedChestInventorySlot(data)
                                }}
                                onClearAllRewards={() => {
                                    setWarnRemoveAllPrizeKey(true)
                                }}
                                onAddItem={() => handleAddPrizeClick()}
                                selectedSlot={selectedChestInventorySlot}
                                data={slotData.current}
                            />
                        </div>
                    </>
                :
                (
                    file.name.endsWith(".yml") && !parsingData
                    ?
                    <ul className="nav nav-tabs mt-3 mr-3 ml-2">
                        <li className="nav-item pointer">
                            <span className={"nav-link border-bottom-0 active bg-secondary"}><FontAwesomeIcon icon={faEdit} /> {t("manual_edit_tab")}</span>
                        </li>
                    </ul>
                : undefined )
            }
            <div className="row m-0 p-0 mr-3 ml-2 h-100" style={{display: (activeTab === 4 || (file.name.endsWith(".yml") && !parsingData && data === undefined) ? "block" : "none")}}>
                <div className="col-12 w-100 h-100 m-0 p-0">
                    {
                        activeTab === 4
                        ?
                        <MonacoEditor
                            width="100%"
                            height="calc(100% - 80px)"
                            language="yaml"
                            theme="vs-dark"
                            defaultValue={monoData.length === 0 ? rawData : monoData}
                            options={{autoClosingQuotes: "always"}}
                            onChange={(e) => handleEditorValueChange(e)}
                        />
                        : undefined
                    }
                </div>
            </div>
        </div>
    )
}

export default FileView
