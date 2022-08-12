import {
    PriorityQueue,
} from '@datastructures-js/priority-queue';
import cloneDeep from "lodash/cloneDeep";
import colors from "theme/grid-item-colors";

import { SPEED, SPEED_AWAIT } from 'constants/speed';
import { IGridItem } from 'interfaces/IGridItem';
import { LooseObject } from 'interfaces/LooseObject';
import { hCost } from 'algorithms/astar/h-cost';
import { hCostHexagon } from './h-cost-hexagon';
import { hCost as hCostDiagonal } from './h-cost-diagonal';
import { reconstructPath } from './reconstruct-path';
import { compare } from 'algorithms/astar/compare';
import { sleep } from 'helpers/sleep';
import GRID_TYPE from 'constants/grid-type';

export async function astar(setGrid: any, grid: Array<Array<IGridItem>>, start: IGridItem, end: IGridItem, speed: SPEED = SPEED.IMMEDIATE, gridType = GRID_TYPE.HEXAGON) {
    const q = new PriorityQueue<IGridItem>(compare);
    q.enqueue(start)
    let cameFrom: LooseObject = {}
    let newGrid = cloneDeep(grid);
    newGrid[start.y][start.x].fCost = 0;
    newGrid[start.y][start.x].gCost = 0;

    let openSetHash = { [start.id]: newGrid[start.y][start.x].fCost };

    while (!q.isEmpty()) {
        const current = q.dequeue();
        const currentX = current.x;
        const currentY = current.y;
        delete openSetHash[current.id];

        // Since we are pushing duplicated grid items to the queue if the fCost is lower, there could be a situation where the grid item is already evaluated
        // In this case we can skip the evaluation of the grid item (as the grid item with the lower fCost is evaluated)
        if (newGrid[currentY][currentX].color === colors.CLOSED) {
            continue;
        }

        if (current.x === end.x && current.y === end.y) {
            // Path found...
            reconstructPath(cameFrom, end, start, setGrid, newGrid, speed);
            return true;
        }

        current.neighbors.forEach((n: IGridItem) => {
            const nx = n.x;
            const ny = n.y;
            const tempGScore = newGrid[currentY][currentX].gCost + n.weight;
            const nGCost = newGrid[ny][nx].gCost;
            if (tempGScore < nGCost) {
                cameFrom[n.id] = current.id;
                newGrid[ny][nx].gCost = tempGScore;
                const hc = gridType === GRID_TYPE.HEXAGON ? hCostHexagon(n, end) : hCostDiagonal(n, end);
                // const hc = hCost(n, end)
                newGrid[ny][nx].fCost = tempGScore + hc
                newGrid[ny][nx].hCost = hc

                // If already in open set, but current fCost is lower
                const alreadyInOpenSetButFCostIsLower = openSetHash[n.id] !== undefined && newGrid[ny][nx].fCost < openSetHash[n.id];

                // If not in open set yet
                const notInOpenSet = openSetHash[n.id] === undefined;

                // If it is closed
                const isClosed = newGrid[ny][nx].color === colors.CLOSED;

                if ((alreadyInOpenSetButFCostIsLower || notInOpenSet) && !isClosed) {
                    q.enqueue(newGrid[ny][nx]);
                    openSetHash[n.id] = newGrid[ny][nx].fCost;
                    if (newGrid[ny][nx].color !== colors.END) {
                        newGrid[ny][nx].color = colors.OPEN
                    }
                }
            }
        })

        const skipWait = newGrid[current.y][current.x].color === colors.CLOSED;
        if (current.id !== start.id) {
            newGrid[current.y][current.x].color = colors.CLOSED;
        }

        if (speed !== SPEED.IMMEDIATE) {
            setGrid(newGrid);
        }
        if (!skipWait && speed !== SPEED.IMMEDIATE) {
            await sleep(SPEED_AWAIT[speed])
        }
    }
    return false;
}