import { faCog, faPen, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { buildOptionToggle } from '../../resources/app/EditorUtil'

interface Props {
    unbreakeable: boolean | undefined,
    onChange(value : boolean | undefined) : void,
}

function PrizeItemUnbreakeableRow(props: Props) {
    const {
        unbreakeable
    } = props

    let [editing, setEditing] = React.useState<boolean>(false)
    let [unsavedValue, setUnsavedValue] = React.useState<boolean | undefined>(unbreakeable)

    let handleChange = (value : string) => {
        if(value === "true") {
            setUnsavedValue(true)
        } else {
            setUnsavedValue(false)
        }
    }

    let doSave = () => {
        props.onChange(unsavedValue)
    }

    let {t} = useTranslation()

    if(!editing) {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><b><FontAwesomeIcon icon={faCog} /> {t("prize_item_editor_unbreakeable_title")}</b></td>
                <td className="w-100">{buildOptionToggle(unsavedValue)}</td>
                <td><span className="btn btn-primary no-break btn-sm" onClick={() => setEditing(true)}><FontAwesomeIcon icon={faPen} /></span></td>
            </tr>
        )
    } else {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><b><FontAwesomeIcon icon={faCog} /> {t("prize_item_editor_unbreakeable_title")}</b></td>
                <td className="w-100">
                    <select className="form-control" value={unsavedValue === true ? "true" : "false"} onChange={(e) => handleChange(e.target.value)}>
                        <option value="true">{t("select_op_yes")}</option>
                        <option value="false">{t("select_op_no")}</option>
                    </select>
                </td>
                <td><span className="btn btn-success no-break btn-sm" onClick={() => {doSave(); setEditing(false)}}><FontAwesomeIcon icon={faSave} /></span></td>
            </tr>
        )
    }
}

export default PrizeItemUnbreakeableRow
