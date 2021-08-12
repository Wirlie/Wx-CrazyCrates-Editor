import React from 'react'
import Modal from './Modal'

interface Props {
    title: string,
    placeholder?: string,
    open: boolean,
    onModalClose(value: string) : void
}

function SingleTextInputModal(props: React.PropsWithChildren<Props>) {
    const {
        title,
        placeholder,
        open
    } = props

    let [inputValue, setInputValue] = React.useState<string>("")

    return (
        <Modal title={title} open={open} defaultCallback={() => {props.onModalClose(inputValue); setInputValue("")}}>
            <>
                {props.children}
                <hr />
                <input type="text" className="form-control" placeholder={placeholder} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            </>
        </Modal>
    )
}

export default SingleTextInputModal
