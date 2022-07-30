import { IGridItem } from "apps/BaseApp/interfaces/IGridItem";
import cloneDeep from "lodash/cloneDeep";

import { TOTAL_COLS, TOTAL_ROWS } from "apps/BaseApp/configs/grid-configs";
import colors from "apps/BaseApp/configs/colors";

export const updateGridWithNeighbors = (grid: Array<Array<IGridItem>>) => {
    const newGrid = cloneDeep(grid);
    newGrid.forEach((row) => {
        row.forEach((item) => {
            const n: Array<any> = [];
            const { x, y } = item;

            // Down
            if (y + 1 < TOTAL_ROWS && grid[y + 1][x].color !== colors.BARRIER) {
                n.push(grid[y + 1][x])
            }

            // Up
            if (y - 1 >= 0 && grid[y - 1][x].color !== colors.BARRIER) {
                n.push(grid[y - 1][x])
            }

            // Right
            if (x + 1 < TOTAL_COLS && grid[y][x + 1].color !== colors.BARRIER) {
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