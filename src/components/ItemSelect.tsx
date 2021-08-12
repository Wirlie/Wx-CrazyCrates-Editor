import Select, { SelectItemRenderer } from 'react-dropdown-select'
import { GetMaterialName, LanguageEntries } from '../resources/app/Language';
import { TranslatedItems, TranslatedMinecraftItem } from '../util/MinecraftItem'

interface Props {
    values: TranslatedMinecraftItem[],
    onChange(values : TranslatedMinecraftItem[]) : void,
}

function ItemSelect(props: Props) {

    let customSelectItemRenderer = ({ item, itemIndex, props, state, methods } : SelectItemRenderer<TranslatedMinecraftItem>) => {
        let label = GetMaterialName(item.name) ?? item.label

        return (
            <div className="text-white p-1 border border-dark" onClick={() => methods.addItem(item)} key={item.name}>
                <span className={"icon-minecraft " + item.css} key={item.name} /> {label}
            </div>
        )
    }

    return (
        <Select 
            className="w-100"
            multi={false}
            options={TranslatedItems} 
            onChange={props.onChange}
            values={props.values}
            itemRenderer={customSelectItemRenderer}
            color={"#FFFFFF"}
            searchBy="mixedLabel"
            labelField="translatedLabel"
        />
    )
}

export default ItemSelect
