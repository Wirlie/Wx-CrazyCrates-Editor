import React from 'react'
import fs from 'fs'
import path from 'path'
import Scrollbars from 'react-custom-scrollbars-2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faCog, faFile, faFolderOpen, faPen, faPlus, faSync } from '@fortawesome/free-solid-svg-icons'
import { ipcRenderer, OpenDialogReturnValue } from 'electron'
import Modal from './modal/Modal'
import SingleTextInputModal from './modal/SingleTextInputModal'
import CCrate from '../resources/app/CCrate'
import Yaml from 'yaml'

interface Props {
    rootPath: string|undefined,
    onPathDefined: (path: string) => void
    onOpenFile: (file: FileInfo) => void
}

interface FileExplorerSettings {
    showIncompatibleFiles: boolean
}

export interface FileInfo {
    directory: boolean,
    name: string,
    fullPath: string,
    parentPath: string
}

function FileExplorer(props: Props) {
    const {
        rootPath
    } = props

    let [settings, setSettings] = React.useState<FileExplorerSettings>({showIncompatibleFiles: false})
    let [openSettings, setOpenSettings] = React.useState<boolean>(false)
    let [openNewFileDialog, setOpenNewFileDialog] = React.useState<boolean>(false)
    let [announceMessage, setAnnounceMessage] = React.useState<string>("")

    let doScan = React.useCallback(() => {
        setDoingScan(true)

        fs.readdir(
            rootPath!!,
            (error, files) => {
                if(error !== null) {
                    setScanError(true)
                    setDoingScan(false)
                    console.error(error)
                    return
                }

                let filesInfo : FileInfo[] = []

                for(let file of files) {
                    if(fs.lstatSync(rootPath + path.sep + file).isDirectory()) {
                        filesInfo.push({
                            name: file,
                            directory: true,
                            fullPath: rootPath + path.sep + file,
                            parentPath: rootPath!!
                        })
                    } else {
                        filesInfo.push({
                            name: file,
                            directory: false,
                            fullPath: rootPath + path.sep + file,
                            parentPath: rootPath!!
                        })
                    }
                }

                let foldersFound = filesInfo.filter((e) => e.directory)
                let filesFound = filesInfo.filter((e) => !e.directory)

                filesInfo = [
                    ...foldersFound,
                    ...filesFound
                ]

                setTimeout(() => {
                    setScanError(false)
                    setListedFiles(filesInfo)
                    setDoingScan(false)
                }, 3000)
            }
        )
    }, [rootPath])

    let handleUpdateListFilesButton = () => {
        if(!doingScan) {
            doScan()
        }
    }

    let [listedFiles, setListedFiles] = React.useState<FileInfo[]>([])
    let [doingScan, setDoingScan] = React.useState<boolean>(false)
    let [scanError, setScanError] = React.useState<boolean>(false)

    React.useEffect(() => {
        if(props.rootPath !== undefined) {
            doScan()
        }
    }, [props.rootPath, doScan])

    let handleOpenFolderButton = () => {
        if(doingScan) return

        ipcRenderer.removeAllListeners('open-file-dialog-result')
        ipcRenderer.on('open-file-dialog-result', (_, result: OpenDialogReturnValue) => {
            ipcRenderer.removeAllListeners('open-file-dialog-result')
            
            console.log(result)

            if(result.canceled) {
                return
            }

            if(result.filePaths[0] === props.rootPath) {
                doScan() //si la ruta no cambia el useEffect() que realiza el escaneo no funcionará ya que este useEffect() observa la ruta y 
                         //al ver que es la misma no ejecutará el efecto, por ello forzamos el re-escaneo.
                return
            }

            setListedFiles([])
            props.onPathDefined(result.filePaths[0])
        })
        ipcRenderer.send('open-folder-dialog')
    }

    if(rootPath === undefined) {
        return (
            <div className="file-explorer h-100 m-0 p-0 border border-dark">
                <div className="title bg-secondary d-flex justify-content-between">
                    <span className="text">Archivos</span>
                </div>
                <div className="loading d-flex justify-content-between align-items-center">
                    Abre una carpeta para comenzar a editar <span className="btn btn-primary btn-sm ml-3" style={{minWidth: "80px"}} onClick={() => handleOpenFolderButton()}><FontAwesomeIcon icon={faFolderOpen} /> Abrir</span>
                </div>
            </div>
        )
    }

    let filesToRender = (!settings.showIncompatibleFiles) ? listedFiles.filter((f) => f.name.endsWith(".yml")) : listedFiles

    let handleNewFileSubmit = (value: string) => {
        setOpenNewFileDialog(false)
        if(value.length > 0 && rootPath !== undefined) {
            if(!value.endsWith(".yml")) {
                value = value + ".yml"
            }

            let tryPath = rootPath + path.sep + value
            console.log("Make new file at: " + tryPath)

            if(fs.existsSync(tryPath)) {
                setAnnounceMessage("Ya existe un archivo con este nombre, no se pudo crear el archivo.")
                return
            }

            let defaultCrate = {
                CrateType: "Roulette",
                CrateName: "&bNueva Caja",
                StartingKeys: 0,
                InGUI: false,
                Slot: 0,
                OpeningBroadCast: false,
                BroadCast: "&f&l%player% &e&lestá abriendo una caja",
                Item: "stone",
                Name: "&bNueva Caja",
                Lore: ["&fUna nueva caja con contenidos", "&fvariados para reclamar"],
                PhysicalKey: {
                    Glowing: true,
                    Name: "&f&lLlave de &b&lNueva Caja",
                    Item: "TRIPWIRE_HOOK",
                    Lore: ["&fUna llave que puede ser canjeada", "&fpor artículos interesantes."]
                },
                Hologram: {
                    Height: 1,
                    Message: ["&bNueva Caja"],
                    Toggle: true
                },
                Prizes: {}
            } as CCrate

            let parsedData = Yaml.stringify({"Crate": defaultCrate})
            fs.writeFileSync(tryPath, parsedData)

            setAnnounceMessage("El archivo fue creado correctamente.")

            let fileInfo = {
                directory: false,
                fullPath: tryPath,
                name: value,
                parentPath: rootPath
            } as FileInfo

            setListedFiles([
                ...listedFiles,
                fileInfo
            ])

            props.onOpenFile(fileInfo)
        }
    }

    return (
        <div className="file-explorer h-100 m-0 p-0 border border-dark">
            <Modal open={openSettings} title="Ajustes del Explorador de Archivos" defaultCallback={() => setOpenSettings(false)}>
                <div className="form-check">
                    <input checked={settings.showIncompatibleFiles} className="form-check-input" type="checkbox" value="" id="viewIncompatibleFiles" onChange={(e) => setSettings({...settings, showIncompatibleFiles: e.target.checked})} />
                    <label className="form-check-label" htmlFor="viewIncompatibleFiles">
                        Ver archivos no compatibles
                    </label>
                </div>
            </Modal>
            <Modal title="Aviso" open={announceMessage.length > 0} defaultCallback={() => setAnnounceMessage("")}>
                {announceMessage}
            </Modal>
            <SingleTextInputModal
                title="Crear nuevo Archivo"
                placeholder="Ingresa un nombre de archivo"
                open={openNewFileDialog}
                onModalClose={(val) => handleNewFileSubmit(val)}
            >
                Ingresa el nombre del archivo a crear para la nueva caja.
            </SingleTextInputModal>
            <div className="title bg-secondary d-flex justify-content-between">
                <span className="text">Archivos</span>
                <div className="h-100 d-flex align-items-center">
                    <span className="simple-hover-button" title="Ajustes" onClick={() => setOpenSettings(true)}>
                        <FontAwesomeIcon icon={faCog} />
                    </span>
                    <span className="simple-hover-button" title="Nueva Caja..." onClick={() => setOpenNewFileDialog(true)}>
                        <FontAwesomeIcon icon={faPlus} />
                    </span>
                    <span className="simple-hover-button" title="Abrir Carpeta" onClick={() => handleOpenFolderButton()}>
                        <FontAwesomeIcon icon={faFolderOpen} />
                    </span>
                    <span className="simple-hover-button" title="Actualizar" onClick={() => handleUpdateListFilesButton()}>
                        <FontAwesomeIcon icon={faSync} />
                    </span>
                </div>
            </div>
            {doingScan
            ?
                <div className="loading">
                    Listando archivos...
                    <div className="progress mt-2 mb-2">
                        <div className="bg-warning progress-bar progress-bar-striped progress-bar-animated w-100" role="progressbar"></div>
                    </div>
                </div>
            : undefined}
            <Scrollbars 
                className="files" style={{height: "calc(100% - " + (doingScan ? 40 + 75 : 40) + "px)"}}
                width="30px"
                renderThumbHorizontal={props => <div {...props} className="thumb-horizontal"/>}
                renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
            >
                {scanError
                ?
                    <div className="loading bg-danger">
                        Error al listar archivos...
                    </div>
                : undefined}
                {
                    filesToRender.length === 0 && !doingScan
                    ?
                    <div className="file-entry">
                        <i>No hay archivos compatibles con el Editor en esta carpeta... para visualizar todos los archivos cambia los ajustes del explorador de archivos.</i>
                    </div>
                    :
                    filesToRender.map((file) => {
                        return (
                            <div className="file-entry" onClick={() => props.onOpenFile(file)} key={file.name} >
                                <FontAwesomeIcon 
                                    icon={file.directory ? faChevronRight : (file.name.endsWith(".yml") ? faPen : faFile)} 
                                    className="mr-2" 
                                    color={file.name.endsWith(".yml") ? "rgb(0, 207, 79)" : "#7E7E7E"} /> 
                                <span 
                                    className="file-name" 
                                    style={{color: (file.name.endsWith(".yml") ? "#FFF" : "#7E7E7E")}}
                                >
                                    {file.name}
                                </span>
                            </div>
                        )
                    })
                }
            </Scrollbars>
        </div>
    )
}

export default FileExplorer
