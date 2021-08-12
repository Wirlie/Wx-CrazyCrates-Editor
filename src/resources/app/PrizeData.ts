export interface PrizeData {
    DisplayName?: string,
    DisplayItem?: string,
    DisplayAmount?: number,
    DisplayEnchantments?: string[],
    Lore?: string[],
    MaxRange?: number,
    Chance?: number,
    Firework?: boolean,
    Commands?: string[],
    Messages?: string[],
    OriginalLore?: string[], //Usado para preservar el lore original (en caso de que se use un ajuste especial)
    Items?: string[]
}