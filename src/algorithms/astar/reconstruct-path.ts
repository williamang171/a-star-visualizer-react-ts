
import cloneDeep from "lodash/cloneDeep";

import { SPEED, SPEED_AWAIT } from 'constants/speed';
import { sleep } from 'helpers/sleep';
import { IGridItem } from "interfaces/IGridItem";
import gridItemColors from "theme/grid-item-colors";

export const reconstructPath = async (cameFrom: any, current: any, start: any, draw: any, grid: any, speed: SPEED) => {
    const path: Array<IGridItem> = [];
    const cachedGrid = cloneDeep(grid);
    let id = current.id;
    while (cameFrom[id]) {
        id = cameFrom[id];
        const idSplited = id.split("-");
        const x = parseInt(idSplited[0].substring(1));
        const y = parseInt(idSplited[1].substring(1));
        path.push(grid[y][x])
    }
    const reversed = path.slice().reverse();
    console.log(`Path length: ${reversed.length}`)

    let index = 0;
    for await (const r of reversed) {
        if (index !== 0) {
            cachedGrid[r.y][r.x] = {
                ...r,
                color: gridItemColors.PATH
            }
            if (speed !== SPEED.IMMEDIATE) {
                await sleep(SPEED_AWAIT[speed]);
            }
            draw(cachedGrid);
        }
        index++;
    }
    cachedGrid[current.y][current.x].color = gridItemColors.END;
    draw(cachedGrid);
}