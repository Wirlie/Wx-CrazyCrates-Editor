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
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import esMXLocale from "./locales/es_MX.json"
import enUSLocale from "./locales/en_US.json"

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      enUS: {
        translation: enUSLocale //enUS always will use the string provided in the t() function.
      },
      esMX: {
        translation: esMXLocale
      }
    },
    lng: "enUS",
    fallbackLng: "enUS",

    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
    debug: true
  });

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
