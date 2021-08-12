import React, { ReactNode } from 'react'
import { formatColors } from '../util/MinecraftUtil'

interface Props {
    children?: React.ReactNode
}

interface State {}

class BukkitColors extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            
        }
    }

    render(): ReactNode {
        if(this.props.children === undefined) {
            return <></>
        } else {
            return formatColors(
                <>
                    {this.props.children}
                </>
            )
        }
    }
}

export default BukkitColors
