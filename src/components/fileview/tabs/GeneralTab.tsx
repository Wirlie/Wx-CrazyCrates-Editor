import CCrate from '../../../resources/app/CCrate';
import { GetItemByName } from '../../../util/MinecraftItem';
import CrateBroadcastMessageRow from '../rows/CrateBroadcastMessageRow';
import CrateBroadcastRow from '../rows/CrateBroadcastRow';
import CrateGUIItemRow from '../rows/CrateGUIItemRow';
import CrateGUILoreRow from '../rows/CrateGUILoreRow';
import CrateGUINameRow from '../rows/CrateGUINameRow';
import CrateGUISlotRow from '../rows/CrateGUISlotRow';
import CrateHologramHeightRow from '../rows/CrateHologramHeightRow';
import CrateHologramMessageRow from '../rows/CrateHologramMessageRow';
import CrateHologramToggleRow from '../rows/CrateHologramToggleRow';
import CrateKeyGlowingRow from '../rows/CrateKeyGlowingRow';
import CrateKeyLoreRow from '../rows/CrateKeyLoreRow';
import CrateKeyMaterialRow from '../rows/CrateKeyMaterialRow';
import CrateKeyNameRow from '../rows/CrateKeyNameRow';
import CrateNameRow from '../rows/CrateNameRow';
import CrateShowInGUIRow from '../rows/CrateShowInGUIRow';
import CrateStartingKeysRow from '../rows/CrateStartingKeysRow';
import CrateTypeRow from '../rows/CrateTypeRow';

interface Props {
    crateData: CCrate | undefined,
    displayTab: boolean,
    onDataUpdate() : void
}

function GeneralTab(props: Props) {
    const {
        crateData,
        displayTab,
        onDataUpdate
    } = props

    return (
        <div className="row m-0 p-0 mr-3 ml-2 pt-3 pb-3 pl-2 pr-2 border border-dark mb-5 border-top-0 bg-secondary" style={{display: (displayTab ? "block" : "none")}}>
            <div className="col-12">
                <h5>&raquo; DATOS GENERALES</h5>
                <table className="table table-dark">
                    <tbody>
                        <CrateNameRow value={crateData?.CrateName} onValueChange={(val) => {crateData!!.CrateName = val; onDataUpdate()}} />
                        <CrateTypeRow value={crateData?.CrateType} onValueChange={(val) => {crateData!!.CrateType = val; onDataUpdate()}} />
                        <CrateStartingKeysRow value={crateData?.StartingKeys} onValueChange={(val) => {crateData!!.StartingKeys = val; onDataUpdate()}} />
                        <CrateShowInGUIRow value={crateData?.InGUI} onValueChange={(val) => {crateData!!.InGUI = val; onDataUpdate()}} />
                        <CrateGUISlotRow value={crateData?.Slot} onValueChange={(val) => {crateData!!.Slot = val; onDataUpdate()}} />
                        <CrateBroadcastRow value={crateData?.OpeningBroadCast} onValueChange={(val) => {crateData!!.OpeningBroadCast = val; onDataUpdate()}} />
                        <CrateBroadcastMessageRow value={crateData?.BroadCast} onValueChange={(val) => {crateData!!.BroadCast = val; onDataUpdate()}} />
                        <CrateGUIItemRow value={GetItemByName((crateData?.Item === undefined || null) ? undefined : (crateData!!.Item!! as string).toLowerCase() as any)} onValueChange={(val) => {crateData!!.Item = val.name.toUpperCase(); onDataUpdate()}} />
                        <CrateGUINameRow value={crateData?.Name} onValueChange={(val) => {crateData!!.Name = val; onDataUpdate()}} />
                        <CrateGUILoreRow value={crateData?.Lore} onValueChange={(val) => {crateData!!.Lore = val; onDataUpdate()}} />
                    </tbody>
                </table>
            </div>
            <div className="col-12 mt-3">
                <h5>&raquo; DATOS LLAVE (KEY) FÍSICA/VIRTUAL</h5>
                <table className="table table-dark">
                    <tbody>
                        <CrateKeyMaterialRow value={GetItemByName((crateData?.PhysicalKey?.Item === undefined || null) ? undefined : (crateData!!.PhysicalKey!!.Item!! as string).toLowerCase() as any)} onValueChange={(val) => {crateData!!.PhysicalKey!!.Item = val.name.toUpperCase(); onDataUpdate()}} />
                        <CrateKeyNameRow value={crateData?.PhysicalKey?.Name} onValueChange={(val) => {crateData!!.PhysicalKey!!.Name = val; onDataUpdate()}} />
                        <CrateKeyLoreRow value={crateData?.PhysicalKey?.Lore} onValueChange={(val) => {crateData!!.PhysicalKey!!.Lore = val; onDataUpdate()}} />
                        <CrateKeyGlowingRow value={crateData?.PhysicalKey?.Glowing} onValueChange={(val) => {crateData!!.PhysicalKey!!.Glowing = val; onDataUpdate()}} />
                    </tbody>
                </table>
            </div>
            <div className="col-12 mt-3">
                <h5>&raquo; HOLOGRAMA</h5>
                <table className="table table-dark">
                    <tbody>
                        <CrateHologramToggleRow value={crateData?.Hologram?.Toggle} onValueChange={(val) => {crateData!!.Hologram!!.Toggle = val; onDataUpdate()}} />
                        <CrateHologramHeightRow value={crateData?.Hologram?.Height} onValueChange={(val) => {crateData!!.Hologram!!.Height = val; onDataUpdate()}} />
                        <CrateHologramMessageRow value={crateData?.Hologram?.Message} onValueChange={(val) => {crateData!!.Hologram!!.Message = val; onDataUpdate()}} />
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default GeneralTab
