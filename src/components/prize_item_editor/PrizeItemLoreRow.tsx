import { faBook, faPen, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { buildOptionLore } from '../../resources/app/EditorUtil'

interface Props {
    lore: string[] | undefined,
    onChange(value : string[] | undefined) : void
}

function PrizeItemLoreRow(props: Props) {
    const {
        lore
    } = props

    let [editing, setEditing] = React.useState<boolean>(false)
    let [unsavedValue, setUnsavedValue] = React.useState<string[] | undefined>(lore)

    let doSave = () => {
        props.onChange(unsavedValue)
    }

    let handleChange = (value : string) => {
        if(value.length === 0) {
            setUnsavedValue(undefined)
        } else {
            setUnsavedValue(value.split("\n"))
        }
    }

    let textareaValue = (unsavedValue ?? []).join("\n")
    let {t} = useTranslation()

    if(!editing) {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><b><FontAwesomeIcon icon={faBook} /> {t("prize_item_editor_lore_title")}</b></td>
                <td className="w-100">{buildOptionLore(unsavedValue)}</td>
                <td><span className="btn btn-primary no-break btn-sm" onClick={() => setEditing(true)}><FontAwesomeIcon icon={faPen} /></span></td>
            </tr>
        )
    } else {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><b><FontAwesomeIcon icon={faBook} /> {t("prize_item_editor_lore_title")}</b></td>
                <td className="w-100">
                    <textarea
                        className="form-control"
                        value={textareaValue}
                        placeholder={t("prize_item_editor_lore_description")}
                        rows={5}
                        onChange={(e) => handleChange(e.target.value)}
                    />
                </td>
                <td><span className="btn btn-success no-break btn-sm" onClick={() => {doSave(); setEditing(false)}}><FontAwesomeIcon icon={faSave} /></span></td>
            </tr>
        )
    }
}

export default PrizeItemLoreRow
