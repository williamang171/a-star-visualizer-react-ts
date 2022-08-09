import * as d3 from "d3";
import { IGridItem } from "interfaces/IGridItem";
import gridItemColors from "theme/grid-item-colors";

// import { generateData } from "apps/MainApp/data";
function getFillColor(x: number, y: number) {
    const startX = 4;
    const startY = 4;
    const endX = 17;
    const endY = 17;
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

//SVG sizes and margins
export const margin = {
    top: 50,
    right: 20,
    bottom: 20,
    left: 50
};
export const width = 850;
export const height = 500;

//The number of columns and rows of the heatmap
export const COLS = 30;
export const ROWS = 20;

//The maximum radius the hexagons can have to still fit the screen
export const hexRadius = d3.min([width / ((COLS + 0.5) * Math.sqrt(3)),
height / ((ROWS + 1 / 3) * 1.5)]) || 0;

export const initialData = generateData(ROWS, COLS);
export const svgWidth = width + margin.left + margin.right;
export const svgHeight = height + margin.top + margin.bottom;
export const gTransform = `translate(${margin.left},${margin.top})`
