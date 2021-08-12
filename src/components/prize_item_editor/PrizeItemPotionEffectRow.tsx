import { faFlask, faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

interface Props {
    display: boolean
}

function PrizeItemPotionEffectRow(props: Props) {
    const {
        display
    } = props

    return (
        <tr className={!display ? "d-none" : ""}>
            <td style={{verticalAlign: "middle", whiteSpace: "nowrap", paddingLeft: "40px"}}><b><FontAwesomeIcon icon={faFlask} /> Efecto de Poción</b></td>
            <td className="w-100">123</td>
            <td><span className="btn btn-primary no-break btn-sm"><FontAwesomeIcon icon={faPen} /></span></td>
        </tr>
    )
}

export default PrizeItemPotionEffectRow
