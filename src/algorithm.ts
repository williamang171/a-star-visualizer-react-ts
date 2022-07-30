import {
    PriorityQueue,
    ICompare
} from '@datastructures-js/priority-queue';
import cloneDeep from "lodash/cloneDeep";
import colors from "./configs/colors"

import { IGridItem } from 'interfaces/IGridItem';
import { LooseObject } from 'interfaces/LooseObject';

const compare: ICompare<IGridItem> = (a: IGridItem, b: IGridItem) => {
    // Prioritize GridItem with lower fCost
    if (a.fCost < b.fCost) {
        return -1;
    }
    return 1;
};

const prepareInfinityGrid = (grid: Array<Array<any>>) => {
    return grid.map((row) => {
        return row.map((item) => Infinity)
    })
}

const hCost = (p1: IGridItem, p2: IGridItem) => {
    const x1 = p1.x;
    const y1 = p1.y;
    const x2 = p2.x;
    const y2 = p2.y;

    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

const reconstructPath = (cameFrom: any, current: any, draw: any, grid: any) => {
    let newGrid = cloneDeep(grid);
    let id = current.id;
    while (cameFrom[id]) {
        // update state with specific id
        // draw()
        id = cameFrom[id];
        console.log(id)
        const x = parseInt(id.charAt(1));
        const y = parseInt(id.charAt(3));
        newGrid[x][y].color = colors.PATH;
        draw(newGrid);
    }
    newGrid[current.x][current.y].color = colors.END;
    draw(newGrid);
}


export function algorithm(setGrid: any, grid: Array<Array<IGridItem>>, start: IGridItem, end: IGridItem) {
    const q = new PriorityQueue<IGridItem>(compare);
    q.enqueue(start)
    let cameFrom: LooseObject = {}
    let gScore = prepareInfinityGrid(grid);
    gScore[start.x][start.y] = 0;
    let openSetHash = { [start.id]: true };
    let newGrid = cloneDeep(grid);
    newGrid[start.x][start.y].fCost = 0;


    while (!q.isEmpty()) {
        const current = q.dequeue();
        // console.log(current.fCost)
        console.log(`Processing ${current.id} with fCost ${current.fCost}`)
        const currentX = current.x;
        const currentY = current.y;
        delete openSetHash[current.id];

        if (current.x === end.x && current.y === end.y) {
            // Path found...
            reconstructPath(cameFrom, end, setGrid, newGrid);
            console.log("path found!")
            return true;
        }

        current.neighbors.forEach((n) => {
            const nx = n.x;
            const ny = n.y;
            const tempGScore = gScore[currentX][currentY] + 1;
            if (tempGScore < gScore[nx][ny]) {
                cameFrom[n.id] = current.id;
                gScore[nx][ny] = tempGScore;
                newGrid[nx][ny].fCost = tempGScore + hCost(n, end)
                if (!openSetHash[n.id]) {
                    q.enqueue(newGrid[nx][ny]);
                    openSetHash[n.id] = true;
                    newGrid[nx][ny].color = colors.OPEN
                }
            }
        })

        // draw()
        setGrid(newGrid);

        if (current.id !== start.id) {
            newGrid[current.x][current.y].color = colors.CLOSED;
        }

        // console.log(q.toArray())
    }
    return false;
}