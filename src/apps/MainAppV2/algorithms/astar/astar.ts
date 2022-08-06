import {
    PriorityQueue,
} from '@datastructures-js/priority-queue';
import cloneDeep from "lodash/cloneDeep";
import colors from "theme/grid-item-colors";

import { IGridItem } from 'apps/BaseApp/interfaces/IGridItem';
import { LooseObject } from 'apps/BaseApp/interfaces/LooseObject';
import { hCost } from "./h-cost";
import { reconstructPath } from './reconstruct-path';
import { compare } from './compare';
import { sleep } from 'helpers/sleep';

export async function algorithm(setGrid: any, grid: Array<Array<IGridItem>>, start: IGridItem, end: IGridItem, speed: string) {
    const q = new PriorityQueue<IGridItem>(compare);
    q.enqueue(start)
    let cameFrom: LooseObject = {}
    let openSetHash = { [start.id]: true };
    let newGrid = cloneDeep(grid);
    newGrid[start.y][start.x].fCost = 0;
    newGrid[start.y][start.x].gCost = 0;

    while (!q.isEmpty()) {
        const current = q.dequeue();
        const currentX = current.x;
        const currentY = current.y;
        delete openSetHash[current.id];

        if (current.x === end.x && current.y === end.y) {
            // Path found...
            console.log("path found!")
            reconstructPath(cameFrom, end, start, setGrid, newGrid);

            return true;
        }

        current.neighbors.forEach((n) => {
            const nx = n.x;
            const ny = n.y;
            const tempGScore = newGrid[currentY][currentX].gCost + 1
            const nGCost = newGrid[ny][nx].gCost;
            if (tempGScore < nGCost) {
                cameFrom[n.id] = current.id;
                newGrid[ny][nx].gCost = tempGScore;
                newGrid[ny][nx].fCost = tempGScore + hCost(n, end)
                newGrid[ny][nx].hCost = hCost(n, end)
                if (!openSetHash[n.id]) {
                    q.enqueue(newGrid[ny][nx]);
                    openSetHash[n.id] = true;
                    newGrid[ny][nx].color = colors.OPEN
                }
            }
        })

        if (current.id !== start.id) {
            newGrid[current.y][current.x].color = colors.CLOSED;
        }

        if (speed === "fast") {
            setGrid(newGrid);
            await sleep(10);
        }
        if (speed === "normal") {
            setGrid(newGrid);
            await sleep(50);
        }
        if (speed === "slow") {
            setGrid(newGrid);
            await sleep(500);
        }

    }
    return false;
}