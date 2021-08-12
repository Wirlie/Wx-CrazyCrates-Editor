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

    const {
        active,
        file
    } = props

    const doParseFile = React.useCallback(() => {
        setErrorMessage("")

        if(!file.name.endsWith(".yml")) {
            setParsingData(false)
            setErrorMessage("El editor solo admite archivos con extensión .yml (YAML)")
            return
        }

        fs.readFile(file.fullPath, (error, data) => {
            if(error != null) {
                setParsingData(false)
                setErrorMessage("Ocurrió un problema crítico que impidió que este archivo se cargara.")
                return
            }

            let rawData = data.toString('utf8')
            setRawData(rawData)
            setMonoData("")
            setParsingData(false)

            try {
                let parsed = YAML.parse(data.toString('utf8'))
                
                if(parsed["Crate"] === undefined) {
                    setErrorMessage("El archivo no es un archivo de Crazy Crates")
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

                    setErrorMessage("El archivo tiene un problema, revisa que la estructura del archivo YAML es correcta.")
                } else {
                    setErrorMessage("Ocurrió un error no esperado al procesar el archivo")
                }
            }
        })
    }, [file.fullPath, file.name])

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
            setErrorMessage("Error la guardar el archivo")
        }

        setRawData(newRawData)
        mainEditorRef.current?.setValue(newRawData)
        setMonoData("")
    }, [data, saveFromMonoData, doParseFile, file.fullPath, updateGlobalLores])

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
            setErrorMessage("Error la guardar el archivo")
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
            let displayName = recalculatePrizesArray[prizeKey].DisplayName
            newPrizesArray[newPrizeKey] = recalculatePrizesArray[prizeKey]

            if(displayName === undefined || displayName.length === 0) {
                let materialName = recalculatePrizesArray[prizeKey].DisplayItem ?? "stone"
                let material = GetItemByName(materialName as any)

                if(material === undefined) {
                    displayName = "Material Desconocido"
                } else {
                    displayName = (GetMaterialName(material.name) ?? material.label)
                }
            }

            if(newPrizeKey !== prizeKey) {
                doSave = true
            }
    
            if(GetItemByName(nameKey as any) === undefined) {
                lore.push("")
                lore.push("&cErrores encontrados:")
                lore.push("&e• &eMaterial desconocido:")
                lore.push("  &f" + nameKey)
            }
    
            slotData.current.push({
                rawIndex: rawIndex,
                lore: <ItemTooltipFormat title={displayName}>
                    {lore.map((line, index) => {
                        return (
                            <div key={index}>
                                {line}<br/>
                            </div>
                        )
                    })}
                </ItemTooltipFormat>,
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
    }, [data, doSaveDataWithoutRecalculation, recalculatePrizesArray])
    
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
                title="¡Vas a borrar el contenido de toda la caja!"
                buttonRender={
                    <>
                        <span className="btn btn-secondary mr-1" onClick={() => setWarnRemoveAllPrizeKey(false)}><FontAwesomeIcon icon={faArrowLeft} /> Cancelar</span>
                        <span className="btn btn-danger" onClick={() => handleRemoveAllPrizesClick()}><FontAwesomeIcon icon={faTrash} /> Borrar</span>
                    </>
                }
            >
                Remover este premio será permanente y no podrá revertirse a menos que tengas una copia previa del archivo.
            </Modal>
            <Modal 
                open={removePrizeKey !== undefined && removePrizeKey !== "cceditor:notification:success"} 
                title="¿Seguro(a) de remover este Premio?"
                buttonRender={
                    <>
                        <span className="btn btn-secondary mr-1" onClick={() => setRemovePrizeKey(undefined)}><FontAwesomeIcon icon={faArrowLeft} /> Cancelar</span>
                        <span className="btn btn-danger" onClick={() => handleRemovePrizeConfirmationClick()}><FontAwesomeIcon icon={faTrash} /> Borrar</span>
                    </>
                }
            >
                Remover este premio será permanente y no podrá revertirse a menos que tengas una copia previa del archivo.
            </Modal>
            <Modal
                open={removePrizeKey === "cceditor:notification:success"}
                title="Recompensa Eliminada"
                defaultCallback={() => setRemovePrizeKey(undefined)}
            >
                La recompensa se ha eliminado correctamente.
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
                    Editaste el archivo manualmente, es necesario re-aplicar los cambios.
                    <span className="btn btn-light" onClick={() => doSaveRaw(monoData)}>Guardar y Actualizar</span>
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
                                <span className={"nav-link border-bottom-0 " + (activeTab === 1 ? "active bg-secondary" : "")} onClick={() => setActiveTab(1)}><FontAwesomeIcon icon={faCog} /> General</span>
                            </li>
                            <li className="nav-item pointer">
                                <span className={"nav-link border-bottom-0 " + (activeTab === 2 ? "active bg-secondary" : "")} onClick={() => setActiveTab(2)}><FontAwesomeIcon icon={faCog} /> Contenido</span>
                            </li>
                            <li className="nav-item pointer">
                                <span className={"nav-link border-bottom-0 " + (activeTab === 3 ? "active bg-secondary" : "")} onClick={() => setActiveTab(3)}><FontAwesomeIcon icon={faAtom} /> Especial</span>
                            </li>
                            <li className="nav-item pointer">
                                <span className={"nav-link border-bottom-0 " + (activeTab === 4 ? "active bg-secondary" : "")} onClick={() => setActiveTab(4)}><FontAwesomeIcon icon={faEdit} /> Manualmente</span>
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
                            <span className={"nav-link border-bottom-0 active bg-secondary"}><FontAwesomeIcon icon={faEdit} /> Manualmente</span>
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
