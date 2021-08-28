import { faBoxes, faPen, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { CCrateType } from '../../../resources/app/CCrate'
import { buildOption } from '../../../resources/app/EditorUtil'

interface Props {
    value: CCrateType | undefined,
    onValueChange(data: CCrateType) : void
}

function CrateTypeRow(props: Props) {
    let {t} = useTranslation()

    const {
        value,
        onValueChange
    } = props

    let crateType = buildOption(value)

    let [enableEdit, setEnableEdit] = React.useState<boolean>(false)
    let [unsavedValue, setUnsavedValue] = React.useState<string>("")

    React.useEffect(() => {
        setUnsavedValue(value ?? "Roulette")
    }, [value])

    let handleSave = () => {
        setEnableEdit(false)
        if(unsavedValue !== value) {
            onValueChange(unsavedValue as CCrateType)
        }
    }

    if(!enableEdit) {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><FontAwesomeIcon icon={faBoxes} /> <b>{t("crate_editor_type_title")}</b></td>
                <td className="w-100">{crateType}</td>
                <td><span className="btn btn-primary no-break btn-sm" onClick={() => setEnableEdit(true)}><FontAwesomeIcon icon={faPen} /></span></td>
            </tr>
        )
    } else {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><FontAwesomeIcon icon={faBoxes} /> <b>{t("crate_editor_type_title")}</b></td>    
                <td>
                    <select className="form-control" value={unsavedValue} onChange={(e) => setUnsavedValue(e.target.value)}>
                        <option value="Cosmic">Cosmic</option>
                        <option value="CrateOnTheGo">CrateOnTheGo</option>
                        <option value="CSGO">CSGO</option>
                        <option value="FireCracker">FireCracker</option>
                        <option value="QuadCrate">QuadCrate</option>
                        <option value="QuickCrate">QuickCrate</option>
                        <option value="Roulette">Roulette</option>
                        <option value="War">War</option>
                        <option value="Wheel">Wheel</option>
                        <option value="Wonder">Wonder</option>
                    </select>
                </td>
                <td><span className="btn btn-success no-break btn-sm" onClick={() => handleSave()}><FontAwesomeIcon icon={faSave} /></span></td>
            </tr>
        )
    }
}

export default CrateTypeRow
