import React from 'react'
import CCrate from '../../../resources/app/CCrate'
import Switch from "react-switch";
import Modal from '../../modal/Modal';
import ItemTooltip from '../../ItemTooltip';
import ItemTooltipFormat from '../../ItemTooltipFormat';
import { parsePlaceholders } from '../../FileView';

interface Props {
    crateData: CCrate | undefined,
    displayTab: boolean,
    onDataUpdate() : void
}

let previousGlobalLoreTextareaTimeOut : NodeJS.Timeout | undefined = undefined

function SpecialTab(props: Props) {
    const {
        crateData,
        displayTab,
        onDataUpdate
    } = props

    let [openWarning, setOpenWarning] = React.useState<boolean>(false)
    let [unsavedTextareaValue, setUnsavedTextareaValue] = React.useState<string[]>([])

    React.useEffect(() => {
        console.log("updated")
        setUnsavedTextareaValue(crateData?.CCEditorConfig?.GlobalLore ?? [])
    }, [crateData?.CCEditorConfig?.GlobalLore])

    let switchLoresToGlobalLores = () => {
        let prizes = crateData!!.Prizes ?? {}
        let prizesKeys = Object.keys(prizes)

        for(let prizeKey of prizesKeys) {
            crateData!!.Prizes!![prizeKey] = {
                ...crateData!!.Prizes!![prizeKey],
                OriginalLore: crateData!!.Prizes!![prizeKey].Lore,
                Lore: [
                    ...parsePlaceholders(crateData!!.CCEditorConfig?.GlobalLore ?? [], crateData!!.Prizes!![prizeKey]),
                    ...(crateData!!.Prizes!![prizeKey].Lore ?? [])
                ]
            }
        }
    }

    let switchGlobalLoresToLores = () => {
        let prizes = crateData!!.Prizes ?? {}
        let prizesKeys = Object.keys(prizes)

        for(let prizeKey of prizesKeys) {
            crateData!!.Prizes!![prizeKey] = {
                ...crateData!!.Prizes!![prizeKey],
                Lore: [
                    ...(crateData!!.Prizes!![prizeKey].OriginalLore ?? [])
                ],
                OriginalLore: undefined,
            }
        }
    }

    let handleGlobalLoreChange = (newValue : boolean) => {
        if(crateData !== undefined) {
            if(newValue) {
                setOpenWarning(true)
                switchLoresToGlobalLores()
            } else {
                switchGlobalLoresToLores()
            }
            crateData.CCEditorConfig!!.UseGlobalLore = newValue
            onDataUpdate()
        }
    }

    let globalLore = unsavedTextareaValue.join("\n")

    let handleGlobalLoreValueChange = (newValue : string) => {
        if(crateData !== undefined) {
            let newArray = newValue.split("\n")
            setUnsavedTextareaValue(newArray)

            if(previousGlobalLoreTextareaTimeOut !== undefined) {
                clearTimeout(previousGlobalLoreTextareaTimeOut)
            }

            previousGlobalLoreTextareaTimeOut = setTimeout(() => {
                crateData.CCEditorConfig!!.GlobalLore = newArray
                onDataUpdate()
            }, 1500)
        }
    }

    return (
        <div className="row m-0 p-0 mr-3 ml-2 pt-3 pb-3 pl-3 pr-3 border border-dark mb-5 border-top-0 bg-secondary" style={{display: (displayTab ? "block" : "none")}}>
            <Modal
                title="Precaución"
                open={openWarning}
                defaultCallback={() => setOpenWarning(false)}
            >
                <p>
                    Habilitar la función de descripción global para todos los premios de esta caja hará que se hagan algunos cambios al archivo .yml de la caja 
                    agregando información extra que no está presente en el esquema original del archivo. 
                </p>
                <p>
                    Esto no afecta negativamente al servidor, simplemente
                    es una advertencia para notificar la adición de información extra al archivo .yml que solo el editor puede procesar, pero que
                    no está presente en el plugin original.
                </p>
            </Modal>
            <div className="col-12 bg-dark p-4">
                <div className="d-flex align-items-center">
                    <Switch checked={crateData?.CCEditorConfig?.UseGlobalLore ?? false} onChange={handleGlobalLoreChange} className="mr-3" />
                    <div>
                        <div>
                            Usar una descripción global para todos los premios.
                        </div>
                        <div className="text-sm mt-2">
                            La descripción global permite definir una descripción que tendrán todos los premios de esta caja <b>Antes</b> de la descripción 
                            específica. Esto es útil si quieres definir una descripción que compartan todos los premios, recuerda que puedes usar algunos
                            placeholders como: &#x7B;Chance&#x7D; &#x7B;DisplayName&#x7D; &#x7B;DisplayAmount&#x7D; &#x7B;CommandCount&#x7D;, los cuales
                            se sustituirán dependiendo del premio.
                        </div>
                    </div>
                </div>
                <div className={"row m-0 p-0" + (!(crateData?.CCEditorConfig?.UseGlobalLore ?? false) ? " d-none" : "")}>
                    <div className="col-12"><hr/></div>
                    <div className="col-6">
                        <textarea rows={6} className="form-control" placeholder="Ingresa una descripción..." onChange={(e) => handleGlobalLoreValueChange(e.target.value)} value={globalLore} />
                    </div>
                    <div className="col-6">
                        <ItemTooltip>
                            <ItemTooltipFormat title={"&bPrevisualización"}>
                                {
                                    globalLore.length === 0
                                    ?
                                    <>
                                        &eIngresa una descripción para su<br/>
                                        &eprevisualización...
                                    </>
                                    : unsavedTextareaValue.map((line) => {
                                        return (
                                            <>
                                                {"&5&o" + line}<br/>
                                            </>
                                        )
                                    })
                                }
                            </ItemTooltipFormat>
                        </ItemTooltip>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SpecialTab
