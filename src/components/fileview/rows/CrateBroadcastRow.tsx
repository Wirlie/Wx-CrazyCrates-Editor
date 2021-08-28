import { faCog, faPen, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { buildOptionToggle } from '../../../resources/app/EditorUtil'

interface Props {
    value: boolean | undefined,
    onValueChange(data: boolean) : void
}

function CrateBroadcastRow(props: Props) {
    let {t} = useTranslation()

    const {
        value,
        onValueChange
    } = props

    let broadcastOpen = buildOptionToggle(value)

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
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><FontAwesomeIcon icon={faCog} /> <b>{t("crate_editor_announce_broadcast_title")}</b></td>
                <td className="w-100">{broadcastOpen}</td>
                <td><span className="btn btn-primary no-break btn-sm" onClick={() => setEnableEdit(true)}><FontAwesomeIcon icon={faPen} /></span></td>
            </tr>
        )
    } else {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><FontAwesomeIcon icon={faCog} /> <b>{t("crate_editor_announce_broadcast_title")}</b></td>
                <td className="w-100">
                    <select className="form-control" value={unsavedValue ? "true" : "false"} onChange={(e) => setUnsavedValue(e.target.value === "true")}>
                        <option value="true">{t("select_op_yes")}</option>
                        <option value="false">{t("select_op_no")}</option>
                    </select>
                </td>
                <td><span className="btn btn-success no-break btn-sm" onClick={() => handleSave()}><FontAwesomeIcon icon={faSave} /></span></td>
            </tr>
        )
    }
}

export default CrateBroadcastRow
