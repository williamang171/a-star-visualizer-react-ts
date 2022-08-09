import { IGridItem } from "interfaces/IGridItem";

import cloneDeep from "lodash/cloneDeep";
import identifyNeighbours from "./identify-neighbours";

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