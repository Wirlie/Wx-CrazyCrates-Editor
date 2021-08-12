import { faTag, faPen, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { buildOptionTooltip } from '../../resources/app/EditorUtil'

interface Props {
    itemName: string | undefined,
    onChange(value: string | undefined) : void
}

function PrizeItemNameRow(props: Props) {
    const {
        itemName
    } = props

    let [editing, setEditing] = React.useState<boolean>(false)
    let [unsavedValue, setUnsavedValue] = React.useState<string | undefined>(itemName)

    let handleChange = (value : string) => {
        if(value.length === 0) {
            setUnsavedValue(undefined)
        } else {
            setUnsavedValue(value)
        }
    }

    let doSave = () => {
        props.onChange(unsavedValue)
    }

    if(!editing) {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><b><FontAwesomeIcon icon={faTag} /> Nombre del Ítem</b></td>
                <td className="w-100">{buildOptionTooltip(unsavedValue)}</td>
                <td><span className="btn btn-primary no-break btn-sm" onClick={() => setEditing(true)}><FontAwesomeIcon icon={faPen} /></span></td>
            </tr>
        )
    } else {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><b><FontAwesomeIcon icon={faTag} /> Nombre del Ítem</b></td>
                <td className="w-100">
                    <input type="text" placeholder="Ingresa un nombre a mostrar (opcional)..." value={unsavedValue} onChange={(e) => handleChange(e.target.value)} className="form-control" />
                </td>
                <td><span className="btn btn-success no-break btn-sm" onClick={() => {doSave(); setEditing(false)}}><FontAwesomeIcon icon={faSave} /></span></td>
            </tr>
        )
    }
}

export default PrizeItemNameRow
