import { IGridItem } from "interfaces/IGridItem";

export const generateGrid = (rows: number, cols: number) => {
    let grid = [];
    for (let i = 0; i < rows; i++) {
        let elements: Array<IGridItem> = [];
        for (let j = 0; j < cols; j++) {
            elements.push({
                x: j,
                y: i,
                id: `x${j}y${i}`,
                color: "#fff",
                fCost: Infinity,
                gCost: Infinity,
                hCost: Infinity,
                neighbors: [],
                weight: 1
            })
        }
        grid.push(elements)
    }
    return grid;
}