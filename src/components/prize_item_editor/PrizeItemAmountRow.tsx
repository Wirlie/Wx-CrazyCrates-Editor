import { faCalculator, faPen, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
    amount: number,
    onChange(newValue: number) : void
}

function PrizeItemAmountRow(props: Props) {
    const {
        amount
    } = props

    let [editing, setEditing] = React.useState<boolean>(false)
    let [unsavedValue, setUnsavedValue] = React.useState<number>(amount)

    let doSave = () => {
        props.onChange(unsavedValue)
    }

    let {t} = useTranslation()

    if(!editing) {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><b><FontAwesomeIcon icon={faCalculator} /> {t("prize_item_editor_amount")}</b></td>
                <td className="w-100">{unsavedValue}</td>
                <td><span className="btn btn-primary no-break btn-sm" onClick={() => setEditing(true)}><FontAwesomeIcon icon={faPen} /></span></td>
            </tr>
        )
    } else {
        return (
            <tr>
                <td style={{verticalAlign: "middle", whiteSpace: "nowrap"}}><b><FontAwesomeIcon icon={faCalculator} /> {t("prize_item_editor_amount")}</b></td>
                <td className="w-100">
                    <input type="number" value={unsavedValue} min={1} max={64} className="form-control" onChange={(e) => setUnsavedValue(parseInt(e.target.value))} />
                </td>
                <td><span className="btn btn-success no-break btn-sm" onClick={() => {doSave(); setEditing(false)}}><FontAwesomeIcon icon={faSave} /></span></td>
            </tr>
        )
    }
}

export default PrizeItemAmountRow
