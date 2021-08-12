import { faPen, faPlus, faTimesCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tooltip from 'rc-tooltip'
import React from 'react'
import { TranslatedMinecraftItem } from '../util/MinecraftItem'
import ItemTooltipFormat from './ItemTooltipFormat'

interface Props {
    rows: number,
    data: SlotData[],
    selectedSlot: SlotData|undefined,
    onOpenRewardEditor: (rawIndex: number, event: React.MouseEvent, data: SlotData) => void,
    onRewardRemove: (rawIndex: number, data: SlotData) => void,
    onClearAllRewards: () => void,
    onSelectSlot: (data: SlotData | undefined) => void,
    onAddItem: () => void
}

interface State {

}

class ChestInventory extends React.Component<Props, State> {

    //Only update component when data is changed...
    shouldComponentUpdate(nextProps : Props) {
        return nextProps.data !== this.props.data || nextProps.selectedSlot !== this.props.selectedSlot
    }

    render() {
        const {
            rows,
            data,
            selectedSlot
        } = this.props

        let handleSelectSlot = (data: SlotData | undefined) => {
            this.props.onSelectSlot(data)
        }

        let handleAddButtonClick = () => {
            this.props.onAddItem()
        }

        let handleEditButtonClick = (event: React.MouseEvent) => {
            if(selectedSlot === undefined) return
            this.props.onOpenRewardEditor(selectedSlot.rawIndex, event, selectedSlot)
        }

        let handleDeleteButtonClick = () => {
            if(selectedSlot === undefined) return
            this.props.onRewardRemove(selectedSlot.rawIndex, selectedSlot)
        }

        let handleDeleteAllButtonClick = () => {
            this.props.onClearAllRewards()
        }

        return (
            <div className="chest-inventory">
                <div className="d-flex">
                    <div className="mr-3">
                    {
                        [...Array(rows)].map((_, rowIndex) => {
                            return (
                                <div className="inventory-row d-flex" key={"row-" + rowIndex}>
                                    {
                                        [...Array(9)].map((_, slotIndex) => {
                                            let rawIndex = (rowIndex * 9) + slotIndex;
                                            let slotData = data.find((e) => e.rawIndex === rawIndex)

                                            if(slotData === undefined) {
                                                return (
                                                    <div className="inventory-slot" onClick={(e) => handleSelectSlot(undefined)} key={"row-" + rowIndex + "-slot-" + slotIndex}>
                                                        <div className="wundefined00 hundefined00 d-flex align-items-center justify-content-center">
                                                            <span className="icon-minecraft" />
                                                        </div>
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <Tooltip  
                                                        placement="bottom" 
                                                        trigger={['hover']}
                                                        mouseLeaveDelay={0}
                                                        mouseEnterDelay={0.25}
                                                        overlay={slotData.lore} 
                                                        key={"row-" + rowIndex + "-slot-" + slotIndex}
                                                    >
                                                        <div className={"inventory-slot " + (selectedSlot !== undefined && selectedSlot.rawIndex === rawIndex ? " selected" : "")} onClick={(e) => handleSelectSlot(slotData!!)}>
                                                            <div className="wundefined00 hundefined00 d-flex align-items-center justify-content-center">
                                                                <div>
                                                                    <span className={"icon-minecraft " + slotData.item?.css}>
                                                                    {
                                                                        slotData.amount > 1
                                                                        ?
                                                                        <span className={"counter " + ((slotData.amount < 10) ? "one-digit" : "two-digit")}>{slotData.amount}</span>
                                                                        : undefined
                                                                    }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Tooltip>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                    </div>
                    <div>
                        <Tooltip  
                            key="tooltip-add-button"
                            placement="right" 
                            trigger={['hover']}
                            mouseLeaveDelay={0}
                            mouseEnterDelay={0}
                            overlay={
                                <ItemTooltipFormat title="&aAgregar Recompensa">
                                    &fDa clic para crear una nueva<br/>
                                    &frecompensa y agregarla al<br/>
                                    &fcontenido de la caja.
                                </ItemTooltipFormat>
                            }
                        >
                            <div className="inventory-button d-flex align-items-center justify-content-center new-button mb-2" onClick={() => handleAddButtonClick()}><FontAwesomeIcon icon={faPlus} /></div>
                        </Tooltip>
                        <Tooltip  
                            key="tooltip-edit-button"
                            placement="right" 
                            trigger={['hover']}
                            mouseLeaveDelay={0}
                            mouseEnterDelay={0}
                            overlay={
                                selectedSlot === undefined
                                ?
                                <ItemTooltipFormat title="&eEditar Recompensa">
                                    &cSelecciona una recompensa<br/>
                                    &cpara poder editar.<br/>
                                    <br/>
                                    &ePara seleccionar una recompensa<br/>
                                    &eda clic izquierdo en el slot de<br/>
                                    &ela recompensa a editar.
                                </ItemTooltipFormat>
                                :
                                <ItemTooltipFormat title="&eEditar Recompensa">
                                    &eDa clic para editar la recompensa<br/>
                                    &eseleccionada.
                                </ItemTooltipFormat>
                            } 
                        >
                            <div className={"inventory-button d-flex align-items-center justify-content-center edit-button mb-2" + (selectedSlot === undefined ? " disabled" : "")} onClick={(e) => handleEditButtonClick(e)}><FontAwesomeIcon icon={faPen} /></div>
                        </Tooltip>
                        <Tooltip  
                            key="tooltip-remove-button"
                            placement="right" 
                            trigger={['hover']}
                            mouseLeaveDelay={0}
                            mouseEnterDelay={0}
                            overlay={
                                selectedSlot === undefined
                                ?
                                <ItemTooltipFormat title="&dEliminar Recompensa">
                                    &cSelecciona una recompensa<br/>
                                    &cpara poder eliminar.<br/>
                                    <br/>
                                    &ePara seleccionar una recompensa<br/>
                                    &eda clic izquierdo en el slot de<br/>
                                    &ela recompensa a eliminar.
                                </ItemTooltipFormat>
                                :
                                <ItemTooltipFormat title="&dEliminar Recompensa">
                                    &eDa clic para eliminar la recompensa<br/>
                                    &eseleccionada.
                                </ItemTooltipFormat>
                            } 
                        >
                            <div className={"inventory-button d-flex align-items-center justify-content-center delete-button mb-2" + (selectedSlot === undefined ? " disabled" : "")} onClick={() => handleDeleteButtonClick()}><FontAwesomeIcon icon={faTrash} /></div>
                        </Tooltip>
                        <Tooltip  
                            key="tooltip-remove-all-button"
                            placement="right" 
                            trigger={['hover']}
                            mouseLeaveDelay={0}
                            mouseEnterDelay={0}
                            overlay={
                                <ItemTooltipFormat title="&dEliminar Recompensa">
                                    &c&lBorrar el contenido de TODA la caja.
                                </ItemTooltipFormat>
                            } 
                        >
                            <div className={"inventory-button d-flex align-items-center justify-content-center delete-button mb-2 mt-2"} onClick={() => handleDeleteAllButtonClick()}><FontAwesomeIcon icon={faTimesCircle} /></div>
                        </Tooltip>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChestInventory

export interface SlotData {
    rawIndex: number,
    lore: JSX.Element,
    item?: TranslatedMinecraftItem | undefined,
    extra?: any,
    amount: number
}