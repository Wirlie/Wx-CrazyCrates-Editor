import { faCog, faPen, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { buildOptionLore } from '../../../resources/app/EditorUtil'

interface Props {
    value: string[] | undefined,
    onValueChange(data: string[]) : void
}

function CrateHologramMessageRow(props: Props) {
    const {
        value,
        onValueChange
    } = props

    let guiLore = buildOptionLore(value)

    let [enableEdit, setEnableEdit] = React.useState<boolean>(false)
    let [unsavedValue, setUnsavedValue] = React.useState<string[]>([])

    React.useEffect(() => {
        setUnsavedValue(value ?? ["&fHolograma de Caja"])
    }, [value])

    let handleSave = () => {
        setEnableEdit(false)
        if(unsavedValue !== value) {
            onValueChange(unsavedValue)
        }
    }

    if(!enableEdit) {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><FontAwesomeIcon icon={faCog} /> <b>Mensaje:</b></td>
                <td className="w-100">{guiLore}</td>
                <td><span className="btn btn-primary no-break btn-sm" onClick={() => setEnableEdit(true)}><FontAwesomeIcon icon={faPen} /></span></td>
            </tr>
        )
    } else {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><FontAwesomeIcon icon={faCog} /> <b>Mensaje:</b></td>
                <td className="w-100">
                    <textarea placeholder="Ingresa un mensaje..." rows={10} value={unsavedValue.join("\n")} className="form-control" onChange={(e) => setUnsavedValue(e.target.value.split("\n"))} />
                </td>
                <td><span className="btn btn-success no-break btn-sm" onClick={() => handleSave()}><FontAwesomeIcon icon={faSave} /></span></td>
            </tr>
        )
    }
}

export default CrateHologramMessageRow
