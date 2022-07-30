export interface IGridItem {
    fCost: number,
    gCost?: number,
    hCost?: number,
    id: string,
    x: number,
    y: number,
    neighbors: Array<IGridItem> | Array<any>,
    color: string
}