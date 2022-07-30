import {
    PriorityQueue
} from '@datastructures-js/priority-queue';
import cloneDeep from "lodash/cloneDeep";
import { useState } from "react";
import colors from "configs/colors"

import { IGridItem } from 'interfaces/IGridItem';
import { LooseObject } from 'interfaces/LooseObject';
import { hCost } from "./h-cost";
import { reconstructPath } from './reconstruct-path';
import { compare } from './compare';

let openSetHash: LooseObject = {};
const q = new PriorityQueue<IGridItem>(compare);
let cameFrom: LooseObject = {}

export function useAstarStep() {
    const [started, setStarted] = useState(false);
    const [foundPath, setFoundPath] = useState(false);

    const startStep = (setGrid: any, grid: any, start: any) => {
        q.enqueue(start)
        openSetHash = { [start.id]: true };
        let newGrid = cloneDeep(grid);
        newGrid[start.y][start.x].fCost = 0;
        newGrid[start.y][start.x].gCost = 0;
        setGrid(newGrid);
        setStarted(true);
    }

    const nextStep = (setGrid: any, grid: any, start: IGridItem, end: IGridItem) => {
        if (foundPath) {
            return;
        }
        const newGrid = cloneDeep(grid);
        const current = q.dequeue();
        console.log(`Processing ${current.id} with fCost ${current.fCost}`)
        const currentX = current.x;
        const currentY = current.y;
        delete openSetHash[current.id];

        if (current.x === end.x && current.y === end.y) {
            // Path found...
            reconstructPath(cameFrom, end, start, setGrid, newGrid);
            console.log("path found!")
            setFoundPath(true);
            openSetHash = {};
            q.clear()
            cameFrom = {};
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
        setGrid(newGrid);
        if (current.id !== start.id) {
            newGrid[current.y][current.x].color = colors.CLOSED;
        }
        setGrid(newGrid);
    }

    return {
        started,
        startStep,
        nextStep
    };
}