import React from 'react'

interface Props {
    title: string
    open: boolean,
    buttonRender?: JSX.Element,
    defaultCallback?: () => void,
    level?: number
}

function Modal(props: React.PropsWithChildren<Props>) {
    const {
        level,
        open,
        title,
        buttonRender,
        defaultCallback
    } = props

    if(!open) return <></>

    return (
        <div className="fmodal-background d-flex align-items-center justify-content-center" style={{zIndex: (level === undefined ? 50000 : (50000 + (level * 100)))}}>
            <div className="fmodal-container bg-dark border p-4">
                <div className="fmodal-title">{title}</div>
                <div className="fmodal-content">
                    {props.children}
                </div>
                <div className="fmodal-buttons mt-3">
                    {
                        buttonRender === undefined
                        ?
                            <span className="btn btn-primary" onClick={() => defaultCallback?.()}>Aceptar</span>
                        : buttonRender
                    }
                </div>
            </div>
        </div>
    )
}

export default Modal
