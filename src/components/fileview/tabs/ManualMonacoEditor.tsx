import MonacoEditor from 'react-monaco-editor'

interface Props {
    value: string | undefined
    onClose() : void,
    onDataChange(value: string) : void
}

function ManualMonacoEditor(props: Props) {

    return (
        <div className={"fmodal-background d-flex align-items-center justify-content-center"}>
            <div className="fmodal-container-full bg-dark p-4">
                <div className="text-right mb-2">
                    <span className="btn btn-primary" onClick={() => props.onClose()}>Cerrar Editor</span>
                </div>
                <MonacoEditor
                    width="100%"
                    height="calc(100% - 80px)"
                    language="yaml"
                    theme="vs-dark"
                    defaultValue={props.value}
                    options={{autoClosingQuotes: "always"}}
                    onChange={(e) => props.onDataChange(e)}
                />
            </div>
        </div>
    )
}

export default ManualMonacoEditor
