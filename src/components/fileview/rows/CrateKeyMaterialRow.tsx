import { faImage, faPen, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Select from 'react-dropdown-select'
import { buildOptionItem } from '../../../resources/app/EditorUtil'
import { GetItemByName, TranslatedItems, TranslatedMinecraftItem } from '../../../util/MinecraftItem'
import ItemSelect from '../../ItemSelect'

interface Props {
    value: TranslatedMinecraftItem | undefined,
    onValueChange(data: TranslatedMinecraftItem) : void
}

function CrateKeyMaterialRow(props: Props) {
    const {
        value,
        onValueChange
    } = props

    let guiItem = buildOptionItem(value?.name)

    let [enableEdit, setEnableEdit] = React.useState<boolean>(false)
    let [unsavedValue, setUnsavedValue] = React.useState<TranslatedMinecraftItem>(GetItemByName("stone")!!)

    React.useEffect(() => {
        setUnsavedValue(value ?? GetItemByName("stone")!!)
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
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><FontAwesomeIcon icon={faImage} /> <b>Material:</b></td>
                <td className="w-100">{guiItem}</td>
                <td><span className="btn btn-primary no-break btn-sm" onClick={() => setEnableEdit(true)}><FontAwesomeIcon icon={faPen} /></span></td>
            </tr>
        )
    } else {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><FontAwesomeIcon icon={faImage} /> <b>Material:</b></td>
                <td className="w-100">
                    <div className="d-flex flex-workarount">
                        <span className={"icon-minecraft mr-3 " + unsavedValue.css} />
                        <ItemSelect
                            values={[unsavedValue]}
                            onChange={(values) => {if(values.length > 0) setUnsavedValue(values[0])}}
                        />
                    </div>
                </td>
                <td><span className="btn btn-success no-break btn-sm" onClick={() => handleSave()}><FontAwesomeIcon icon={faSave} /></span></td>
            </tr>
        )
    }
}

export default CrateKeyMaterialRow
