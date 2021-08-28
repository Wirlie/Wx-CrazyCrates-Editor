import { faCogs, faFolderPlus, faInfoCircle, faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { constant_item_flags, ItemFlag } from '../../resources/app/Constants'
import { GetItemFlagName } from '../../resources/app/Language'
import Modal from '../modal/Modal'

interface Props {
    flags: ItemFlag[] | undefined,
    onChange(value: ItemFlag[] | undefined) : void 
}

function PrizeItemFlagsRow(props: Props) {
    const {
        flags
    } = props

    let remainingOptions : ItemFlag[] = []

    if(flags !== undefined) {
        for(let constItemFlag of constant_item_flags) {
            let found = false

            for(let currentFlag of flags) {
                if(currentFlag === constItemFlag) {
                    found = true
                    break
                }
            }

            if(!found) {
                remainingOptions.push(constItemFlag)
            }
        }
    } else {
        for(let constItemFlag of constant_item_flags) {
            remainingOptions.push(constItemFlag)
        }
    }

    let [openAddModal, setOpenAddModal] = React.useState<boolean>(false)
    let [selectedFlag, setSelectedFlag] = React.useState<ItemFlag | undefined>(remainingOptions.length === 0 ? undefined : remainingOptions[0])

    let handleAddItemFlagButton = () => {
        if(flags === undefined) {
            props.onChange([selectedFlag ?? remainingOptions[0]])
        } else {
            props.onChange([
                ...flags,
                selectedFlag ?? remainingOptions[0]
            ])
        }

        setOpenAddModal(false)
        setSelectedFlag(undefined)
    }

    let handleRemoveItemFlagButton = (data : ItemFlag) => {
        if(flags !== undefined) {
            let newArray : ItemFlag[] = []

            for(let currentItemFlag of flags) {
                if(currentItemFlag === data) continue
                newArray.push(currentItemFlag)
            }

            if(newArray.length === 0) {
                props.onChange(undefined)
            } else {
                props.onChange([...newArray])
            }
        }
    }

    let handleAddAllItemFlagsButton = () => {
        props.onChange([...constant_item_flags])
        setOpenAddModal(false)
    }

    let {t} = useTranslation()

    return (
        <>
            <Modal 
                open={openAddModal} 
                title={t("prize_item_editor_flags_add_modal_title")} 
                defaultCallback={() => setOpenAddModal(false)} 
                level={2}
                buttonRender={
                    <div className="d-flex justify-content-between">
                        <div>
                            <span className="btn btn-danger mr-2" onClick={() => setOpenAddModal(false)}><FontAwesomeIcon icon={faTimes} /> {t("button_cancel")}</span>
                            <span className="btn btn-success" onClick={() => handleAddItemFlagButton()}><FontAwesomeIcon icon={faPlus} /> {t("button_add")}</span>
                        </div>
                        <span className="btn btn-secondary" onClick={() => handleAddAllItemFlagsButton()}><FontAwesomeIcon icon={faFolderPlus} /> {t("button_add_all")}</span>
                    </div>
                }
            >
                <div>
                    <div className="bg-secondary text-sm p-3">
                        <FontAwesomeIcon icon={faInfoCircle} /> {t("prize_item_editor_flags_description")}
                    </div>
                    <select className="form-control mt-3" value={selectedFlag} onChange={(e) => setSelectedFlag(e.target.value as ItemFlag)}>
                        {
                            remainingOptions.map((element) => {
                                return (
                                    <option key={element} value={element}>{GetItemFlagName(element)}</option>
                                )
                            })
                        }
                    </select>
                </div>
            </Modal>
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><b><FontAwesomeIcon icon={faCogs} /> {t("prize_item_editor_flags_title")}</b></td>
                <td className="w-100" colSpan={2}>
                    <div>
                        {
                            flags === undefined || flags.length === 0
                            ?
                                <div className="bg-secondary p-2 text-sm text-center">
                                    {t("prize_item_editor_flags_no_flags")}
                                </div>
                            : 
                                flags.map((el) => {
                                    return (
                                        <div className="p-2 border border-dark mb-1 d-flex justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <span className={"icon-minecraft mr-2 icon-minecraft-name-tag"} />
                                                <div>
                                                    <div>{el}</div>
                                                    <div className="text-sm text-success">{GetItemFlagName(el)}</div>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="btn btn-danger btn-sm" onClick={() => handleRemoveItemFlagButton(el)}><FontAwesomeIcon icon={faTrash} /> {t("button_delete")}</span>
                                            </div>
                                        </div>
                                    )
                                })
                        }
                    </div>
                    {
                        remainingOptions.length > 0 ?
                        <div className="mt-2">
                            <span className="btn btn-success btn-sm" onClick={() => setOpenAddModal(true)}><FontAwesomeIcon icon={faPlus} /> {t("button_add")}</span>
                        </div>
                        : undefined
                    }
                </td>
            </tr>
        </>
    )
}

export default PrizeItemFlagsRow
