import React, { ReactNode } from 'react'
import BukkitColors from './BukkitColors'

interface Props {
    title: string,
    debug? : boolean
}

interface State {

}

export class ItemTooltipFormat extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render(): ReactNode {
        return (
            <BukkitColors debug={this.props.debug}>
                <div className="tooltip-title">{this.props.title}</div>
                {this.props.children}
            </BukkitColors>
        )
    }
}

export default ItemTooltipFormat

