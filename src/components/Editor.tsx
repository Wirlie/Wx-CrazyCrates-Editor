import React from 'react'
import { ipcRenderer } from 'electron'
import FileExplorer, { FileInfo } from './FileExplorer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faPen, faPlus } from '@fortawesome/free-solid-svg-icons'
import OpenFilesTab from './OpenFilesTab'
import FileView from './FileView'
import Scrollbars from 'react-custom-scrollbars-2'
import { useTranslation } from 'react-i18next'

interface Props {}

function Editor(props: Props) {
    let rightContainerReference = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        console.log("send resize...")
        ipcRenderer.send('adjust-window-dimensions-min-size', 1000, 500)
        ipcRenderer.send('adjust-window-dimensions-max-size-screen')
        ipcRenderer.send('adjust-window-dimensions-auto')
        ipcRenderer.send('adjust-window-title', 'Wx Crazy Crates Editor')

        ipcRenderer.removeAllListeners('updated-window-dimensions')
        ipcRenderer.on('updated-window-dimensions', (_, dimensions : number[]) => {
            if(rightContainerReference.current !== null) {
                let divReference = rightContainerReference.current!!
                divReference.style.maxHeight = (dimensions[1] - 42 - 42) + "px"
                divReference.style.height = (dimensions[1] - 42 - 42) + "px"
            }
        })

        ipcRenderer.send('retrieve-window-dimensions')
    }, [])

    let [currentPath, setCurrentPath] = React.useState<string>()
    let [openFiles, setOpenFiles] = React.useState<FileInfo[]>([])
    let [activeFile, setActiveFile] = React.useState<FileInfo|undefined>(undefined)

    React.useEffect(() => {
        if(activeFile !== undefined && openFiles.length > 0) {
            let tryFile = openFiles.find((sf) => sf.fullPath === activeFile!!.fullPath)
            if(tryFile === undefined) {
                setActiveFile(openFiles[0])
            }
        }
    }, [activeFile, openFiles])

    let handleOpenFile = (file: FileInfo) => {
        let tryFile = openFiles.find((sf) => sf.fullPath === file.fullPath)

        if(tryFile !== undefined) {
            setActiveFile(tryFile)
            return
        }

        setOpenFiles(
            [
                ...openFiles,
                file
            ]
        )

        setActiveFile(file)
    }

    let handleTabClose = (index : number) => {
        let newArray : FileInfo[] = []
        let indexArray = 0
        for(let file of openFiles) {
            if(indexArray === index) {
                indexArray++
                continue
            }
            newArray.push(file)
            indexArray++
        }
        setOpenFiles(newArray)
    }

    let { t } = useTranslation()

    return (
        <>  
            <div className="container-fluid h-100 app-container">
                <div className="row h-100">
                    <div className="col-xxl-2 col-xl-3 col-md-4 h-100 m-0 p-0">
                        <FileExplorer 
                            onPathDefined={(path) => setCurrentPath(path)}
                            onOpenFile={handleOpenFile}
                            rootPath={currentPath} 
                        />
                    </div>
                    <div className="col-xxl-10 col-xl-9 col-md-8 m-0 p-0">
                        <OpenFilesTab 
                            openFiles={openFiles} 
                            activeFile={activeFile} 
                            onActiveTabChanged={(file) => setActiveFile(file)}
                            onTabClose={(index) => handleTabClose(index)}
                        />
                        <div ref={rightContainerReference} className="app-right-container">
                            <Scrollbars
                                renderThumbHorizontal={props => <div {...props} className="thumb-horizontal"/>}
                                renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                                className="h-100"
                            >
                                {
                                    openFiles.length === 0
                                    ?
                                    <div className="text-center d-flex align-items-center justify-content-center p-4 flex-column" style={{height: "calc(100% - 43px)"}}>
                                        <div>
                                            <FontAwesomeIcon icon={faFile} size={"3x"} className="mb-3 mr-4" /><FontAwesomeIcon icon={faPlus} size={"2x"} className="mb-3 mr-4" /><FontAwesomeIcon icon={faPen} size={"3x"} className="mb-3" />
                                        </div>
                                        {t("select_file_to_edit")}
                                    </div>
                                    : 
                                    openFiles.map((file, index) => {
                                        return (
                                            <FileView active={file === activeFile} file={file} key={file.fullPath} />
                                        )
                                    })
                                }
                            </Scrollbars>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

/*

<div className="text-center">
    <ChestInventory 
        rows={Math.ceil(prizesKeys.length / 9)} 
        data={slotData} 
        onClickSlot={(_index, _e, data) => {
            let prizeKey = data.extra as string
            setEditingPrizeKey(prizeKey)
        }}
    />
</div>
*/

export default Editor
