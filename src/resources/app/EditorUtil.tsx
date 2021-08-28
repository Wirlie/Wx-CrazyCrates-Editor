import { faCheck, faExclamationTriangle, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { GetItemByName } from "../../util/MinecraftItem"
import { formatColors } from "../../util/MinecraftUtil"
import { GetMaterialName } from "./Language"
import i18n from "i18next"

export const buildUndefinedJSX = () => <span className="text-danger"><FontAwesomeIcon icon={faExclamationTriangle} /> {i18n.t("not_defined")}</span>
export const buildTooltipJSX = (child: JSX.Element) => <span className="mc-tooltip p-1 pl-2 pr-2 d-inline-block">{child}</span>

export const buildOption = (check: any, renderer?: (element: JSX.Element) => JSX.Element | string) => {
    if(check === undefined || check === null || (typeof check === 'string' && (check.trim().length === 0))) {
        return buildUndefinedJSX()
    }

    if(renderer === undefined) {
        return check as JSX.Element
    }

    return renderer(check as JSX.Element)
}
export const buildOptionTooltip = (check: any) => buildOption(check, (el) => buildTooltipJSX(formatColors(el)))
export const buildOptionToggle = (check: any) => {
    if(check === undefined || check === null) {
        return buildUndefinedJSX()
    }

    if(check === true) {
        return <><FontAwesomeIcon icon={faCheck} /> {i18n.t("select_op_yes")}</>
    } else {
        return <><FontAwesomeIcon icon={faTimes} /> {i18n.t("select_op_no")}</>
    }
}
export const buildOptionItem = (check: string | undefined) => {
    if(check === undefined || check === null) {
        return buildUndefinedJSX()
    }

    let item = GetItemByName(check.toLowerCase() as any) ?? GetItemByName("air")!!
    return <><span className={"icon-minecraft " + item.css} /> {GetMaterialName(item.name) ?? item.label}</>
}
export const buildOptionLore = (check : any) => {
    if(check === undefined || check === null) {
        return buildUndefinedJSX()
    }

    let itemLore : any[] = check

    return (
        <span className="mc-tooltip p-1 pl-2 pr-2 d-inline-block">
            {
                itemLore.map((line) => {
                    return (
                        <>{formatColors(line)}<br/></>
                    )
                })
            }
        </span>
    )
}
export const buildSafe = (data: any, callback: () => JSX.Element | string) : JSX.Element | string | undefined => {
    if(data === undefined) {
        return undefined
    }

    return callback()
}