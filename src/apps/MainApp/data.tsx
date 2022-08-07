import gridItemColors from "theme/grid-item-colors";
import { IGridItem } from 'interfaces/IGridItem';

export const ROWS = 20;
export const COLS = 20;
export const SQUARE_SIZE = 28;

const startX = 2;
const startY = 2;
const endX = 17;
const endY = 17;

let data: IGridItem[] = [];

function getFillColor(x: number, y: number) {
    if (x === startX && y === startY) {
        return gridItemColors.START;
    }
    if (x === endX && y === endY) {
        return gridItemColors.END;
    }
    return gridItemColors.BLANK;
}

for (let y = 0; y < COLS; y++) {
    for (let x = 0; x < ROWS; x++) {
        data.push({
            x: x,
            y: y,
            color: getFillColor(x, y),
            fCost: Infinity,
            hCost: Infinity,
            gCost: Infinity,
            id: `x${x}-y${y}`,
            neighbors: []
        });
    }
}

export { data };
