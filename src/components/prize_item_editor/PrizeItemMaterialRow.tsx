import { faAirFreshener, faPen, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetMaterialName } from '../../resources/app/Language'
import { GetItemByName, TranslatedMinecraftItem } from '../../util/MinecraftItem'
import ItemSelect from '../ItemSelect'

interface Props {
    material: TranslatedMinecraftItem,
    onChange(values: TranslatedMinecraftItem[]) : void
}

function PrizeItemNameRow(props: Props) {
    const {
        material
    } = props

    let [editing, setEditing] = React.useState<boolean>(false)
    let [unsavedValue, setUnsavedValue] = React.useState<TranslatedMinecraftItem>(material)

    let minecraftMaterial = GetItemByName(material.name as any) ?? GetItemByName("stone")!!
    let translatedItemName = GetMaterialName(material.name) ?? material.label

    let doSave = () => {
        props.onChange([unsavedValue])
    }

    let handleChange = (values : TranslatedMinecraftItem[]) => {
        if(values.length > 0) {
            setUnsavedValue(values[0])
        }
    }

    let {t} = useTranslation()

    if(!editing) {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><b><FontAwesomeIcon icon={faAirFreshener} /> {t("prize_item_editor_material_title")}</b></td>
                <td className="w-100">
                    <span className={"icon-minecraft mr-2 " + material.css} /> <b>{translatedItemName}</b>
                </td>
                <td><span className="btn btn-primary no-break btn-sm" onClick={() => setEditing(true)}><FontAwesomeIcon icon={faPen} /></span></td>
            </tr>
        )
    } else {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><b><FontAwesomeIcon icon={faAirFreshener} /> {t("prize_item_editor_material_title")}</b></td>
                <td className="w-100">
                    <ItemSelect
                        values={[minecraftMaterial]}
                        onChange={(values) => handleChange(values)}
                    />
                </td>
                <td><span className="btn btn-success no-break btn-sm" onClick={() => {doSave(); setEditing(false)}}><FontAwesomeIcon icon={faSave} /></span></td>
            </tr>
        )
    }
}

export default PrizeItemNameRow
