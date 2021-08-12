import { PrizeData } from "./PrizeData"

export interface CCEditorConfig {
    UseGlobalLore: undefined | boolean,
    GlobalLore: undefined | string[]
}

export interface CCrate {
    CrateType: undefined | CCrateType,
    CrateName: undefined | string,
    StartingKeys: undefined | number,
    InGUI: undefined | boolean,
    Slot: undefined | number,
    OpeningBroadCast: undefined | boolean,
    BroadCast: undefined | string,
    Item: undefined | string,
    Name: undefined | string,
    Lore: undefined | string[],
    PhysicalKey: undefined | CCratePhysicalKey,
    Hologram: undefined | CCrateHologram,
    CCEditorConfig: undefined | CCEditorConfig,
    Prizes: undefined | {[key: string]: PrizeData}
}

export interface CCratePhysicalKey {
    Name: undefined | string,
    Lore: undefined | string[],
    Item: undefined | string,
    Glowing: undefined | boolean
}

export interface CCrateHologram {
    Toggle: undefined | boolean,
    Height: undefined | number,
    Message: undefined | string[]
}

export type CCrateType = "Cosmic" | "CrateOnTheGo" | "CSGO" | "FireCracker" | "QuadCrate" | "QuickCrate" | "Roulette" | "War" | "Wheel" | "Wonder"

export default CCrate