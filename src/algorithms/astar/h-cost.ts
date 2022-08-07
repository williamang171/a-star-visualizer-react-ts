import { IGridItem } from 'interfaces/IGridItem';

export const hCost = (p1: IGridItem, p2: IGridItem) => {
    const x1 = p1.x;
    const y1 = p1.y;
    const x2 = p2.x;
    const y2 = p2.y;

    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}