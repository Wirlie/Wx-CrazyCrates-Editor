import { faBookMedical, faInfo, faInfoCircle, faPen, faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { constant_enchantments, Enchantment, EnchantmentAndLevel } from '../../resources/app/Constants'
import { GetEnchantmentLevelAsRoman, GetEnchantmentName } from '../../resources/app/Language'
import Modal from '../modal/Modal'

interface Props {
    enchantments: EnchantmentAndLevel[] | undefined,
    onChange(value: EnchantmentAndLevel[] | undefined) : void 
}

function PrizeItemEnchantmentsRow(props: Props) {
    const {
        enchantments
    } = props

    let remainingOptions : Enchantment[] = []

    if(enchantments !== undefined) {
        for(let constEnchantment of constant_enchantments) {
            let found = false
            for(let currentEnchantment of enchantments) {
                if(currentEnchantment.enchantment === constEnchantment) {
                    found = true
                    break
                }
            }

            if(!found) {
                remainingOptions.push(constEnchantment)
            }
        }
    } else {
        for(let constEnchantment of constant_enchantments) {
            remainingOptions.push(constEnchantment)
        }
    }

    let sortedRemainingOptions = remainingOptions.sort((a, b) => GetEnchantmentName(a).localeCompare(GetEnchantmentName(b)))

    let [openAddModal, setOpenAddModal] = React.useState<boolean>(false)
    let [selectedEnchantment, setSelectedEnchantment] = React.useState<Enchantment | undefined>(remainingOptions.length === 0 ? undefined : remainingOptions[0])
    let [selectedLevel, setSelectedLevel] = React.useState<number>(1)

    let handleAddEnchantmentButton = () => {
        if(enchantments === undefined) {
            props.onChange([{
                enchantment: selectedEnchantment ?? remainingOptions[0],
                level: selectedLevel
            }])
        } else {
            props.onChange([
                ...enchantments,
                {
                    enchantment: selectedEnchantment ?? remainingOptions[0],
                    level: selectedLevel
                }
            ])
        }

        setOpenAddModal(false)
        setSelectedEnchantment(undefined)
        setSelectedLevel(1)
        console.log("done")
    }

    let handleRemoveEnchantmentButton = (data : Enchantment) => {
        if(enchantments !== undefined) {
            let newArray : EnchantmentAndLevel[] = []
            for(let currentEnchantment of enchantments) {
                if(currentEnchantment.enchantment === data) continue
                newArray.push(currentEnchantment)
            }

            if(newArray.length === 0) {
                props.onChange(undefined)
            } else {
                props.onChange([...newArray])
            }
        }
    }

    return (
        <>
            <Modal 
                open={openAddModal} 
                title="Agregar Encantamiento" 
                defaultCallback={() => setOpenAddModal(false)} 
                level={2}
                buttonRender={
                    <>
                        <span className="btn btn-danger mr-2" onClick={() => setOpenAddModal(false)}><FontAwesomeIcon icon={faTimes} /> Cancelar</span>
                        <span className="btn btn-success" onClick={() => handleAddEnchantmentButton()}><FontAwesomeIcon icon={faPlus} /> Agregar</span>
                    </>
                }
            >
                <div>
                    <div className="bg-secondary text-sm p-3">
                        <FontAwesomeIcon icon={faInfoCircle} /> Selecciona un encantamiento de la lista de opciones, y posteriormente da clic en el botón 'Agregar'. Los encantamientos que ya hayas seleccionado no aparecerán en la lista desplegable.
                    </div>
                    <select className="form-control mt-3" value={selectedEnchantment} onChange={(e) => setSelectedEnchantment(e.target.value as Enchantment)}>
                        {
                            sortedRemainingOptions.map((element) => {
                                return (
                                    <option key={element} value={element}>{GetEnchantmentName(element)}</option>
                                )
                            })
                        }
                    </select>
                    <label className="mt-3">Nivel de Encantamiento:</label>
                    <input type="number" min={1} max={10} value={selectedLevel ?? 1} className="form-control" onChange={(e) => setSelectedLevel(parseInt(e.target.value))} />
                </div>
            </Modal>
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><b><FontAwesomeIcon icon={faBookMedical} /> Encantamientos</b></td>
                <td className="w-100" colSpan={2}>
                    <div>
                        {
                            enchantments === undefined || enchantments.length === 0
                            ?
                                <div className="bg-secondary p-2 text-sm text-center">
                                    Aún no se han definido encantamientos
                                </div>
                            : 
                                enchantments.map((el) => {
                                    return (
                                        <div className="p-2 border border-dark mb-1 d-flex justify-content-between">
                                            <div>
                                                <span className={"icon-minecraft mr-2 icon-minecraft-enchanted-book"} /> {GetEnchantmentName(el.enchantment)} {GetEnchantmentLevelAsRoman(el.level)}
                                            </div>
                                            <div>
                                                <span className="btn btn-danger btn-sm" onClick={() => handleRemoveEnchantmentButton(el.enchantment)}><FontAwesomeIcon icon={faTrash} /> Borrar</span>
                                            </div>
                                        </div>
                                    )
                                })
                        }
                    </div>
                    {
                        remainingOptions.length > 0 ?
                        <div className="mt-2">
                            <span className="btn btn-success btn-sm" onClick={() => setOpenAddModal(true)}><FontAwesomeIcon icon={faPlus} /> Agregar</span>
                        </div>
                        : undefined
                    }
                </td>
            </tr>
        </>
    )
}

export default PrizeItemEnchantmentsRow
