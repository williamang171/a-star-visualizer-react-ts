import { IGridItem } from "interfaces/IGridItem";
import GRID_TYPE from "constants/grid-type";
import { updateGridWithNeighborsHexagon } from "./hexagon";
import { updateGridWithNeighborsSquare } from "./square";

export const updateGridWithNeighbors = (grid: Array<Array<IGridItem>>, totalRows: number, totalCols: number, gridType: GRID_TYPE, allowDiagonal: boolean = true) => {

    if (gridType === GRID_TYPE.HEXAGON) {
        return updateGridWithNeighborsHexagon(grid, totalRows, totalCols);
    }

    if (gridType === GRID_TYPE.SQUARE) {
        return updateGridWithNeighborsSquare(grid, totalRows, totalCols, allowDiagonal);
    }

    throw new Error(`${GRID_TYPE} not supported`);
}