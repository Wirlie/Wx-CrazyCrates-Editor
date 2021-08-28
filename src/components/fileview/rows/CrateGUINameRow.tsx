import { faTag, faPen, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { buildOptionTooltip } from '../../../resources/app/EditorUtil'

interface Props {
    value: string | undefined,
    onValueChange(data: string) : void
}

function CrateGUINameRow(props: Props) {
    let {t} = useTranslation()

    const {
        value,
        onValueChange
    } = props

    let guiName = buildOptionTooltip(value)

    let [enableEdit, setEnableEdit] = React.useState<boolean>(false)
    let [unsavedValue, setUnsavedValue] = React.useState<string>("")

    React.useEffect(() => {
        setUnsavedValue(value ?? t("crate_editor_gui_name_default"))
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
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><FontAwesomeIcon icon={faTag} /> <b>{t("crate_editor_gui_name_title")}</b></td>
                <td className="w-100">{guiName}</td>
                <td><span className="btn btn-primary no-break btn-sm" onClick={() => setEnableEdit(true)}><FontAwesomeIcon icon={faPen} /></span></td>
            </tr>
        )
    } else {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><FontAwesomeIcon icon={faTag} /> <b>{t("crate_editor_gui_name_title")}</b></td>
                <td className="w-100"><input type="text" placeholder={t("crate_editor_gui_name_input_placeholder")} value={unsavedValue} className="form-control" onChange={(e) => setUnsavedValue(e.target.value)} /></td>
                <td><span className="btn btn-success no-break btn-sm" onClick={() => handleSave()}><FontAwesomeIcon icon={faSave} /></span></td>
            </tr>
        )
    }
}

export default CrateGUINameRow
