import React from 'react'
import { ipcRenderer } from 'electron'
import { FileFilter, OpenDialogReturnValue } from 'electron/main'
import Modal from './modal/Modal'
import fs from 'fs'
import YAML from 'yaml'
import { YAMLSemanticError } from 'yaml/util'
import { RouteComponentProps, withRouter } from 'react-router-dom'

interface Props extends RouteComponentProps {
    onPathSet: (path: string) => void
}

function Home(props: Props) {

    let [errorSelectFile, setErrorSelectFile] = React.useState<boolean>(false)
    let [errorImportFile, setErrorImportFile] = React.useState<boolean>(false)
    let [importingFile, setImportingFile] = React.useState<boolean>(false)
    let [errorMessage, setErrorMessage] = React.useState<undefined|JSX.Element>()

    React.useEffect(() => {
        console.log("send resize...")
        ipcRenderer.send('adjust-window-dimensions-size', 600, 500)
        ipcRenderer.send('adjust-window-dimensions-min-size', 600, 500)
        ipcRenderer.send('adjust-window-dimensions-max-size', 1000, 700)
        ipcRenderer.send('adjust-window-title', 'Abrir un archivo...')
    }, [])

    let openFileHandle = () => {
        ipcRenderer.removeAllListeners('open-file-dialog-result')

        ipcRenderer.on('open-file-dialog-result', (_, result: OpenDialogReturnValue) => {
            ipcRenderer.removeAllListeners('open-file-dialog-result')
            
            console.log(result)

            if(result.canceled) {
                setErrorSelectFile(true)
                return
            }

            props.onPathSet(result.filePaths[0])
            props.history.push("/editor")
            return

            setImportingFile(true)

            fs.readFile(result.filePaths[0], (error, data) => {
                if(error != null) {
                    setImportingFile(false)
                    setErrorImportFile(true)
                    return
                }

                try {
                    let parsed = YAML.parse(data.toString('utf8'))
                    console.log(parsed)

                    if(parsed["Crate"] === undefined) {
                        setImportingFile(false)
                        setErrorMessage(<span>El archivo .yml que ingresaste no es un archivo .yml de una caja del plugin Crazy Crates.</span>)
                        return
                    }

                    
                    props.history.push("/editor")
                } catch(ex: any) {
                    console.log(ex)

                    setImportingFile(false)

                    if(ex instanceof YAMLSemanticError) {
                        let error = ex as YAMLSemanticError
                        let fullData = data.toString('utf8').split(/\r?\n/)

                        error.makePretty()
                        setErrorMessage(
                            <div>
                                {error.message}<br/><br/>
                                Puedes intentar corregir el problema manualmente, el problema se encuentra en la línea {error.linePos?.start.line}, columna {error.linePos?.start.col} del archivo .yml<br/><br/>
                                Ubicación aproximada del error:
                                <pre>
                                    {fullData[error.linePos!!.start.line - 1]}<br/>
                                    {fullData[error.linePos!!.start.line]}<br/>
                                    {fullData[error.linePos!!.start.line + 1]}
                                </pre>
                            </div>
                        )
                    } else {
                        setErrorMessage(<span>"Error desconocido al importar, ver logs"</span>)
                    }
                }
            })
        })

        ipcRenderer.send('open-folder-dialog')
    }

    if(importingFile) {
        return (
            <>
                <div className="container-fluid h-100">
                    <div className="row justify-content-center align-items-center h-100">
                        <div className="col-10 text-center bg-dark p-5 border">
                            <p>
                                Importando archivo, espera un momento...
                            </p>
                            <div className="progress">
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100} style={{width: "100%"}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Modal 
                open={errorMessage !== undefined}
                title={"Ocurrió un error al procesar el archivo YAML"}
                defaultCallback={() => setErrorMessage(undefined)}
            >
                {errorMessage}
            </Modal>
            <Modal 
                open={errorImportFile}
                title={"Ocurrió un error al importar"}
                defaultCallback={() => setErrorImportFile(false)}
            >
                Ocurrió un problema al importar la configuración, si el problema persiste reporta el problema.
            </Modal>
            <Modal 
                open={errorSelectFile}
                title={"No seleccionaste un archivo"}
                defaultCallback={() => setErrorSelectFile(false)}
            >
                Es indispensable que selecciones un archivo de configuración para poder comenzar a editar.
            </Modal>
            <div className="container-fluid h-100">
                <div className="row justify-content-center align-items-center h-100">
                    <div className="col-10 text-center bg-dark  p-5 border">
                        <p>
                            ¡Bienvenido(a) al editor de cajas del plugin Crazy Crates! Abre el archivo .yml que contenga la información de la configuración.
                        </p>
                        <span className="btn btn-primary w-100" onClick={() => openFileHandle()}>Abrir archivo...</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default withRouter(Home)
