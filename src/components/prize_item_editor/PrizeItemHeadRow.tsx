import { faCog, faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
    display: boolean
}

function PrizeItemHeadRow(props: Props) {
    const {
        display
    } = props

    let {t} = useTranslation()

    //TODO: This needs to be implemented...

    return (
        <tr className={!display ? "d-none" : ""}>
            <td style={{verticalAlign: "middle", whiteSpace: "nowrap", paddingLeft: "40px"}}><b><FontAwesomeIcon icon={faCog} /> {t("prize_item_head_title")}</b></td>
            <td className="w-100">......</td>
            <td><span className="btn btn-primary no-break btn-sm"><FontAwesomeIcon icon={faPen} /></span></td>
        </tr>
    )
}

export default PrizeItemHeadRow
