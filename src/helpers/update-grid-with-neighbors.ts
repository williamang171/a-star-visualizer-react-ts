import { IGridItem } from "interfaces/IGridItem";
import cloneDeep from "lodash/cloneDeep";

import colors from "theme/grid-item-colors";

export const updateGridWithNeighbors = (grid: Array<Array<IGridItem>>, totalRows: number, totalCols: number) => {
    const newGrid = cloneDeep(grid);
    newGrid.forEach((row) => {
        row.forEach((item) => {
            const n: Array<any> = [];
            const { x, y } = item;

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

            item.neighbors = n;
        })
    })
    return newGrid;
}