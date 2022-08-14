export interface IGridItem {
    fCost: number,
    gCost: number,
    hCost: number,
    id: string,
    x: number,
    y: number,
    neighbors: Array<IGridItem>,
    color: string,
    hexX: number;
    hexY: number;
    hexZ: number;
    weight: number;
}