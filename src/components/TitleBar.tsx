import { ipcRenderer } from 'electron'

function TitleBar() {
    return (
        <div className="title-bar d-flex justify-content-between align-items-center">
            <div className="text">Wx CrazyCrates Editor</div>
            <span>
                <span className="btn btn-close" title="Cerrar Aplicación" onClick={() => ipcRenderer.send('close-window')}>x</span>
            </span>
        </div>
    )
}

export default TitleBar
