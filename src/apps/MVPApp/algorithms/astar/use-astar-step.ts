import {
    PriorityQueue
} from '@datastructures-js/priority-queue';
import cloneDeep from "lodash/cloneDeep";
import { useRef, useState } from "react";
import colors from "theme/grid-item-colors";

import { IGridItem } from 'interfaces/IGridItem';

import { reconstructPath } from './reconstruct-path';
import { compare } from 'algorithms/astar/compare';
import { hCost } from 'algorithms/astar/h-cost';

type DrawGrid = (grid: Array<Array<IGridItem>>) => void;

export function useAstarStep() {
    const [started, setStarted] = useState(false);
    const [foundPath, setFoundPath] = useState(false);
    const openSetHash = useRef<Record<string, boolean>>({});
    const cameFrom = useRef<Record<string, string>>({});
    const q = useRef(new PriorityQueue<IGridItem>(compare));

    const startStep = (setGrid: DrawGrid, grid: Array<Array<IGridItem>>, start: IGridItem, end: IGridItem) => {
        q.current.enqueue(start)
        openSetHash.current = { [start.id]: true };
        const newGrid = cloneDeep(grid);
        newGrid[start.y][start.x].fCost = 0;
        newGrid[start.y][start.x].gCost = 0;
        setGrid(newGrid);
        setStarted(true);
        nextStep(setGrid, newGrid, start, end)
    }

    const nextStep = (setGrid: DrawGrid, grid: Array<Array<IGridItem>>, start: IGridItem, end: IGridItem) => {
        if (foundPath) {
            return;
        }
        const newGrid = cloneDeep(grid);
        const current = q.current.dequeue();
        if (!current) {
            return;
        }
        console.log(`Processing ${current.id} with fCost ${current.fCost}`)
        const currentX = current.x;
        const currentY = current.y;
        delete openSetHash.current[current.id];

        if (current.x === end.x && current.y === end.y) {
            // Path found...
            reconstructPath(cameFrom.current, end, start, setGrid, newGrid);
            console.log("path found!")
            setFoundPath(true);
            openSetHash.current = {};
            q.current.clear()
            cameFrom.current = {};
            return true;
        }

        current.neighbors.forEach((n) => {
            const nx = n.x;
            const ny = n.y;
            const tempGScore = newGrid[currentY][currentX].gCost + 1
            const nGCost = newGrid[ny][nx].gCost;
            if (tempGScore < nGCost) {
                cameFrom.current[n.id] = current.id;
                newGrid[ny][nx].gCost = tempGScore;
                newGrid[ny][nx].fCost = tempGScore + hCost(n, end)
                newGrid[ny][nx].hCost = hCost(n, end)
                if (!openSetHash.current[n.id]) {
                    q.current.enqueue(newGrid[ny][nx]);
                    openSetHash.current[n.id] = true;
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
