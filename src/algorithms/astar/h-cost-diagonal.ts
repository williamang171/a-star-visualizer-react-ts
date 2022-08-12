import { IGridItem } from 'interfaces/IGridItem';

const D = 1;
const D2 = 1.4;

export const hCost = (p1: IGridItem, p2: IGridItem) => {
    const x1 = p1.x;
    const y1 = p1.y;
    const x2 = p2.x;
    const y2 = p2.y;
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);

    return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy)
}