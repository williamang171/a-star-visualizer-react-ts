
import cloneDeep from "lodash/cloneDeep";
import colors from "theme/grid-item-colors";

import { IGridItem } from 'interfaces/IGridItem';


export const reconstructPath = (cameFrom: Record<string, string>, current: IGridItem, start: IGridItem, draw: (grid: Array<Array<IGridItem>>) => void, grid: Array<Array<IGridItem>>) => {
    const newGrid = cloneDeep(grid);
    let id = current.id;
    while (cameFrom[id]) {
        id = cameFrom[id];
        const x = parseInt(id.charAt(1));
        const y = parseInt(id.charAt(3));
        newGrid[y][x].color = colors.PATH;
        draw(newGrid);
    }
    newGrid[start.y][start.x].color = colors.START;
    newGrid[current.y][current.x].color = colors.END;
    draw(newGrid);
}