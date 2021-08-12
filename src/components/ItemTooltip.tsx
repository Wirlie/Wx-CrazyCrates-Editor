import React from 'react'

interface Props {}

function ItemTooltip(props: React.PropsWithChildren<Props>) {
    const {
        children
    } = props

    return (
        <div className="mc-tooltip">
            <div className="mc-tooltip-inner">
                {children}
            </div>
        </div>
    )
}

export default ItemTooltip
