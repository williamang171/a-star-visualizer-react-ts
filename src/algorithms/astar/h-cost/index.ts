import GRID_TYPE from 'constants/grid-type';
import { IGridItem } from 'interfaces/IGridItem';

export const hCostHexagon = (p1: IGridItem, p2: IGridItem) => {
    const x1 = p1.hexX;
    const y1 = p1.hexY;
    const z1 = p1.hexZ;
    const x2 = p2.hexX;
    const y2 = p2.hexY;
    const z2 = p2.hexZ;

    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2), Math.abs(z1 - z2))
}

export const hCostSquare = (p1: IGridItem, p2: IGridItem, allowDiagonal: boolean = true) => {
    const D = 1;
    const D2 = 1.4;

    const x1 = p1.x;
    const y1 = p1.y;
    const x2 = p2.x;
    const y2 = p2.y;

    if (!allowDiagonal) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);;
    }

    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);
    return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy)
}

export const hCost = (p1: IGridItem, p2: IGridItem, gridType: GRID_TYPE = GRID_TYPE.HEXAGON, allowDiagonal: boolean = true) => {
    if (gridType === GRID_TYPE.HEXAGON) {
        return hCostHexagon(p1, p2);
    }

    if (gridType === GRID_TYPE.SQUARE) {
        return hCostSquare(p1, p2, allowDiagonal);
    }

    throw new Error(`${gridType} not supported.`)
}