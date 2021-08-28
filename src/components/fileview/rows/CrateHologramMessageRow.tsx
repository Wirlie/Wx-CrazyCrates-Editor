import { faCog, faPen, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { buildOptionLore } from '../../../resources/app/EditorUtil'

interface Props {
    value: string[] | undefined,
    onValueChange(data: string[]) : void
}

function CrateHologramMessageRow(props: Props) {
    let {t} = useTranslation()

    const {
        value,
        onValueChange
    } = props

    let guiLore = buildOptionLore(value)

    let [enableEdit, setEnableEdit] = React.useState<boolean>(false)
    let [unsavedValue, setUnsavedValue] = React.useState<string[]>([])

    React.useEffect(() => {
        setUnsavedValue(value ?? [t("crate_editor_hologram_message_default")])
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
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><FontAwesomeIcon icon={faCog} /> <b>{t("crate_editor_hologram_message_title")}</b></td>
                <td className="w-100">{guiLore}</td>
                <td><span className="btn btn-primary no-break btn-sm" onClick={() => setEnableEdit(true)}><FontAwesomeIcon icon={faPen} /></span></td>
            </tr>
        )
    } else {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><FontAwesomeIcon icon={faCog} /> <b>{t("crate_editor_hologram_message_title")}</b></td>
                <td className="w-100">
                    <textarea placeholder={t("crate_editor_hologram_message_input_placeholder")} rows={10} value={unsavedValue.join("\n")} className="form-control" onChange={(e) => setUnsavedValue(e.target.value.split("\n"))} />
                </td>
                <td><span className="btn btn-success no-break btn-sm" onClick={() => handleSave()}><FontAwesomeIcon icon={faSave} /></span></td>
            </tr>
        )
    }
}

export default CrateHologramMessageRow
