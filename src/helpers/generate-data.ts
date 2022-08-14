import { IGridItem } from "interfaces/IGridItem";
import gridItemColors from "theme/grid-item-colors";
import { ROWS, COLS } from "data/grid-settings";

const startX = 3;
const startY = 3;
const endX = COLS - 4;
const endY = ROWS - 4;

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
    let xOffset = 0;
    let zOffset = 0;
    for (let y = 0; y < rows; y++) {

        // For hexagon coords offsets
        // If current row is odd number (results in 2nd row, 4th row, 6th row), remember row 1 has index 0 thus row 2 has index 1
        if (y !== 0 && y % 2 === 1) {
            zOffset -= 1;
        }
        // If current row is even number (results in 3rd row, 5th row, etc.), remember row 1 has index 0 thus row 3 has index 2
        if (y !== 0 && y % 2 === 0) {
            xOffset -= 1;
        }

        for (let x = 0; x < cols; x++) {
            data.push({
                hexY: y,
                hexX: x + xOffset,
                hexZ: -x + zOffset,
                x: x,
                y: y,
                color: getFillColor(x, y),
                fCost: Infinity,
                hCost: Infinity,
                gCost: Infinity,
                id: `x${x}-y${y}`,
                neighbors: [],
                weight: 1
            });
        }
    }
    return data;
}