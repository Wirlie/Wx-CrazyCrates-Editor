import { faKey, faPen, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { buildOption } from '../../../resources/app/EditorUtil'

interface Props {
    value: number | undefined,
    onValueChange(data: number) : void
}

function CrateStartingKeysRow(props: Props) {
    let {t} = useTranslation()
    
    const {
        value,
        onValueChange
    } = props

    let crateStartingKeys = buildOption(value, (el) => el + " " + t("crate_editor_starting_keys_keys"))

    let [enableEdit, setEnableEdit] = React.useState<boolean>(false)
    let [unsavedValue, setUnsavedValue] = React.useState<number>(0)

    React.useEffect(() => {
        setUnsavedValue(value ?? 0)
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
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><FontAwesomeIcon icon={faKey} /> <b>{t("crate_editor_starting_keys_title")}</b></td>
                <td className="w-100">{crateStartingKeys}</td>
                <td><span className="btn btn-primary no-break btn-sm" onClick={() => setEnableEdit(true)}><FontAwesomeIcon icon={faPen} /></span></td>
            </tr>
        )
    } else {
       return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><FontAwesomeIcon icon={faKey} /> <b>{t("crate_editor_starting_keys_title")}</b></td>
                <td className="w-100"><input type="number" value={unsavedValue} className="form-control" min={0} onChange={(e) => setUnsavedValue(parseInt(e.target.value))} /></td>
                <td><span className="btn btn-success no-break btn-sm" onClick={() => handleSave()}><FontAwesomeIcon icon={faSave} /></span></td>
            </tr>
        )
    }
}

export default CrateStartingKeysRow
