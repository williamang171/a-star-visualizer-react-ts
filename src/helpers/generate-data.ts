import { IGridItem } from "interfaces/IGridItem";
import gridItemColors from "theme/grid-item-colors";

const startX = 3;
const startY = 3;
const endX = 16;
const endY = 16;

export function getFillColor(x: number, y: number) {
    if (x === startX && y === startY) {
        return gridItemColors.START;
    }
    if (x === endX && y === endY) {
        return gridItemColors.END;
    }
    return gridItemColors.BLANK;
}

export function generateData(rows: number, cols: number) {
    let data: IGridItem[] = [];
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
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
    return data;
}