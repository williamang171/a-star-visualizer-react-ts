import cloneDeep from "lodash/cloneDeep";

import colors from "theme/grid-item-colors";
import { IGridItem } from "interfaces/IGridItem";

export function identifyNeighbours(grid: Array<Array<IGridItem>>, gridItem: IGridItem, totalRows: number, totalCols: number) {
    const { x, y } = gridItem;
    const neighbors = [];

    // Is even
    if (y === 0 || y % 2 === 0) {
        // Top left
        if (y - 1 >= 0 && x - 1 >= 0 && grid[y - 1][x - 1].color !== colors.BARRIER) {
            neighbors.push(grid[y - 1][x - 1]);
        }

        // Top right
        if (y - 1 >= 0 && grid[y - 1][x].color !== colors.BARRIER) {
            neighbors.push(grid[y - 1][x]);
        }

        // Bottom left
        if (y + 1 < totalRows && x - 1 >= 0 && grid[y + 1][x - 1].color !== colors.BARRIER) {
            neighbors.push(grid[y + 1][x - 1]);
        }

        // Bottom right
        if (y + 1 < totalRows && grid[y + 1][x].color !== colors.BARRIER) {
            neighbors.push(grid[y + 1][x]);
        }
    }

    // Is Odd
    if (y % 2 > 0) {
        // Top left
        if (y - 1 >= 0 && grid[y - 1][x].color !== colors.BARRIER) {
            neighbors.push(grid[y - 1][x]);
        }

        // Top right
        if (y - 1 >= 0 && x + 1 < totalCols && grid[y - 1][x + 1].color !== colors.BARRIER) {
            neighbors.push(grid[y - 1][x + 1]);
        }

        // Bottom left
        if (y + 1 < totalRows && grid[y + 1][x].color !== colors.BARRIER) {
            neighbors.push(grid[y + 1][x]);
        }

        // Bottom right
        if (y + 1 < totalRows && x + 1 < totalCols && grid[y + 1][x + 1].color !== colors.BARRIER) {
            neighbors.push(grid[y + 1][x + 1]);
        }
    }

    // Right
    if (x + 1 < totalCols && grid[y][x + 1].color !== colors.BARRIER) {
        neighbors.push(grid[y][x + 1])
    }

    // Left
    if (x - 1 >= 0 && grid[y][x - 1].color !== colors.BARRIER) {
        neighbors.push(grid[y][x - 1])
    }

    return neighbors;
}

export const updateGridWithNeighbors = (grid: Array<Array<IGridItem>>, totalRows: number, totalCols: number) => {
    const newGrid = cloneDeep(grid);
    newGrid.forEach((row) => {
        row.forEach((item) => {
            const n = identifyNeighbours(grid, item, totalRows, totalCols)
            item.neighbors = n;
        })
    })
    return newGrid;
}