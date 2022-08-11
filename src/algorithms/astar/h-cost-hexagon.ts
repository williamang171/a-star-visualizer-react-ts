import { IGridItem } from 'interfaces/IGridItem';

export const hCostHexagon = (p1: IGridItem, p2: IGridItem) => {
    const x1 = p1.hexX || 0;
    const y1 = p1.hexY || 0;
    const z1 = p1.hexZ || 0;
    const x2 = p2.hexX || 0;
    const y2 = p2.hexY || 0;
    const z2 = p2.hexZ || 0;

    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2), Math.abs(z1 - z2))
}