import { faHashtag, faPen, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { buildOption } from '../../resources/app/EditorUtil'

interface Props {
    durability: number | undefined,
    onChange(value: number | undefined) : void
}

function PrizeItemDurabilityRow(props: Props) {
    const {
        durability
    } = props

    let [editing, setEditing] = React.useState<boolean>(false)
    let [unsavedValue, setUnsavedValue] = React.useState<number | undefined>(durability)

    let handleChange = (value : number) => {
        if(value === 0) {
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
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><b><FontAwesomeIcon icon={faHashtag} /> Durabilidad del Ítem</b></td>
                <td className="w-100">{buildOption(unsavedValue === undefined ? undefined : unsavedValue + "")}</td>
                <td><span className="btn btn-primary no-break btn-sm" onClick={() => setEditing(true)}><FontAwesomeIcon icon={faPen} /></span></td>
            </tr>
        )
    } else {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><b><FontAwesomeIcon icon={faHashtag} /> Durabilidad del Ítem</b></td>
                <td className="w-100">
                    <input type="number" min={0} value={unsavedValue ?? 0} className="form-control" onChange={(e) => handleChange(parseInt(e.target.value))} />
                </td>
                <td><span className="btn btn-success no-break btn-sm" onClick={() => {doSave(); setEditing(false)}}><FontAwesomeIcon icon={faSave} /></span></td>
            </tr>
        )
    }
}

export default PrizeItemDurabilityRow
