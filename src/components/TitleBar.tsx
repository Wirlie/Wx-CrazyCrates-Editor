import { ipcRenderer } from 'electron'
import { useTranslation } from 'react-i18next'

function TitleBar() {

    let {t} = useTranslation()

    return (
        <div className="title-bar d-flex justify-content-between align-items-center">
            <div className="text">Wx CrazyCrates Editor</div>
            <span>
                <span className="btn btn-close" title={t("button_close_app")} onClick={() => ipcRenderer.send('close-window')}>x</span>
            </span>
        </div>
    )
}

export default TitleBar
