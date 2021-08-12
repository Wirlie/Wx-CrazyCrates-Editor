import './App.css'
import './styles/chest_inventory.scss'
import './styles/modal.scss'
import './styles/app.scss'
import './styles/file_explorer.scss'
import './styles/open_files_tab.scss'
import './styles/file_view.scss'
import './resources/items/item_css.css'
import './resources/tooltip/tooltip.css'
import './resources/minecraft/minecraft-font.scss'
import './resources/roboto/roboto-font.scss'
import { Switch } from 'react-router-dom'
import Editor from './components/Editor'
import TitleBar from './components/TitleBar'

function App() {
  return (
    <div className="d-flex flex-column h-100">
      <TitleBar />
      <div className="flex-grow-1">
        <Switch>
            <Editor />
        </Switch>
      </div>
    </div>
  );
}

export default App;
