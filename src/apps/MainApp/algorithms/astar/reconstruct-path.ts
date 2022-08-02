
import cloneDeep from "lodash/cloneDeep";
import colors from "theme/grid-item-colors";
import { sleep } from 'helpers/sleep';

export const reconstructPath = async (cameFrom: any, current: any, start: any, draw: any, grid: any, drawPath: any) => {
    const path = [];
    let newGrid = cloneDeep(grid);
    let id = current.id;
    while (cameFrom[id]) {
        id = cameFrom[id];
        const idSplited = id.split("-");
        const x = parseInt(idSplited[0].substring(1));
        const y = parseInt(idSplited[1].substring(1));
        newGrid[y][x].color = colors.PATH;
        path.push(newGrid[y][x])
    }
    newGrid[start.y][start.x].color = colors.START;
    newGrid[current.y][current.x].color = colors.END;
    const reversed = path.slice().reverse();

    for await (const r of reversed) {
        drawPath(r);
        await sleep(10);
    }
    drawPath(newGrid[start.y][start.x])
    drawPath(newGrid[current.y][current.x])
}