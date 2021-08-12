import { faCog, faPen, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { buildOptionToggle } from '../../../resources/app/EditorUtil'

interface Props {
    value: boolean | undefined,
    onValueChange(data: boolean) : void
}

function CrateShowInGUIRow(props: Props) {
    const {
        value,
        onValueChange
    } = props

    let guiShow = buildOptionToggle(value)

    let [enableEdit, setEnableEdit] = React.useState<boolean>(false)
    let [unsavedValue, setUnsavedValue] = React.useState<boolean>(false)

    React.useEffect(() => {
        setUnsavedValue(value ?? false)
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
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><FontAwesomeIcon icon={faCog} /> <b>Mostrar en GUI:</b></td>
                <td className="w-100">{guiShow}</td>
                <td><span className="btn btn-primary no-break btn-sm" onClick={() => setEnableEdit(true)}><FontAwesomeIcon icon={faPen} /></span></td>
            </tr>
        )
    } else {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><FontAwesomeIcon icon={faCog} /> <b>Mostrar en GUI:</b></td>
                <td className="w-100">
                    <select className="form-control" value={unsavedValue ? "true" : "false"} onChange={(e) => setUnsavedValue(e.target.value === "true")}>
                        <option value="true">SI</option>
                        <option value="false">NO</option>
                    </select>
                </td>
                <td><span className="btn btn-success no-break btn-sm" onClick={() => handleSave()}><FontAwesomeIcon icon={faSave} /></span></td>
            </tr>
        )
    }
}

export default CrateShowInGUIRow
