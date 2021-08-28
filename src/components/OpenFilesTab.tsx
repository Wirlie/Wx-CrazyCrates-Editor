import { faFile, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { FileInfo } from './FileExplorer'

interface Props {
    openFiles: FileInfo[],
    activeFile: FileInfo | undefined,
    onActiveTabChanged: (file: FileInfo) => void,
    onTabClose: (index: number) => void
}

function OpenFilesTab(props: Props) {
    const {
        openFiles,
        activeFile,
        onTabClose,
        onActiveTabChanged
    } = props


    let {t} = useTranslation()

    return (
        <div className="open-files-tab d-flex border border-dark d-block flex-no-wrap">
            {
                openFiles.map((file, index) => {
                    return (
                        <div className={"open-file-tab border border-dark" + (activeFile === file ? " bg-primary" : "")} key={file.fullPath + "-" + index} onClick={() => onActiveTabChanged(file)}>
                            <FontAwesomeIcon icon={faFile} className="mr-2" /> {file.name} <FontAwesomeIcon onClick={(e) => {onTabClose(index); e.stopPropagation()}} icon={faTimes} size="sm" className="ml-2" title={t("close_file")} color="red" />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default OpenFilesTab
