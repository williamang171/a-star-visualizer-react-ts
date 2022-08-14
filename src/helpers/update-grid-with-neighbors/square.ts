import { IGridItem } from "interfaces/IGridItem";
import cloneDeep from "lodash/cloneDeep";

import colors from "theme/grid-item-colors";

const D2 = 1.4;

export function identifyNeighbours(grid: Array<Array<IGridItem>>, gridItem: IGridItem, totalRows: number, totalCols: number, allowDiagonal: boolean = true) {
    const { x, y } = gridItem;
    const n = [];

    // Down
    if (y + 1 < totalRows && grid[y + 1][x].color !== colors.BARRIER) {
        n.push(grid[y + 1][x])
    }

    // Up
    if (y - 1 >= 0 && grid[y - 1][x].color !== colors.BARRIER) {
        n.push(grid[y - 1][x])
    }

    // Right
    if (x + 1 < totalCols && grid[y][x + 1].color !== colors.BARRIER) {
        n.push(grid[y][x + 1])
    }

    // Left
    if (x - 1 >= 0 && grid[y][x - 1].color !== colors.BARRIER) {
        n.push(grid[y][x - 1])
    }

    if (!allowDiagonal) {
        return n;
    }

    // Top Left
    if (y - 1 >= 0 && x - 1 >= 0 && grid[y - 1][x - 1].color !== colors.BARRIER) {
        n.push({
            ...grid[y - 1][x - 1],
            weight: D2
        })
    }

    // Top right
    if (y - 1 >= 0 && x + 1 < totalCols && grid[y - 1][x + 1].color !== colors.BARRIER) {
        n.push({
            ...grid[y - 1][x + 1],
            weight: D2
        })
    }

    // Bottom left
    if (y + 1 < totalRows && x - 1 >= 0 && grid[y + 1][x - 1].color !== colors.BARRIER) {
        n.push({
            ...grid[y + 1][x - 1],
            weight: D2
        })
    }

    // Bottom right
    if (y + 1 < totalRows && x + 1 < totalCols && grid[y + 1][x + 1].color !== colors.BARRIER) {
        n.push({
            ...grid[y + 1][x + 1],
            weight: D2
        })
    }

    return n;
}

export const updateGridWithNeighborsSquare = (grid: Array<Array<IGridItem>>, totalRows: number, totalCols: number, allowDiagonal: boolean = true) => {
    const newGrid = cloneDeep(grid);
    newGrid.forEach((row) => {
        row.forEach((item) => {
            item.neighbors = identifyNeighbours(grid, item, totalRows, totalCols, allowDiagonal);
        })
    })
    return newGrid;
}