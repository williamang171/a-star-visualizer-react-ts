import { useEffect } from 'react'
import styled from "styled-components";
import flattenDeep from "lodash/flattenDeep";

import Legends from 'components/Legends';
import { IGridItem } from 'interfaces/IGridItem';
import gridItemColors from 'theme/grid-item-colors';
import { updateGridWithNeighbors } from 'helpers/update-grid-with-neighbors';
import { astar } from "algorithms/astar";

import Actions from './components/Actions';
import Grid from "./components/Grid";
import { initialData, ROWS, COLS } from 'data/hexagon-grid';

import useAppState from './hooks/useAppState';

const AppContainer = styled.div` 
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex-wrap: wrap; 
`;

export default function MainApp() {
    const { speed,
        setSpeed,
        showCost,
        setShowCost,
        gridType,
        setGridType,
        triggerRunPath, setTriggerRunPath,
        data,
        setData,
        allowDiagonal,
        setAllowDiagonal } = useAppState();

    const findPath = () => {
        // Transform grid[] to grid[][] 
        const grid: Array<Array<IGridItem>> = [];
        data.forEach((d) => {
            if (grid.length <= d.y) {
                grid.push([]);
            }
            grid[d.y].push(d)
        })

        // Update grid with neighbors
        const gridWithNeighbors = updateGridWithNeighbors(grid, ROWS, COLS, gridType, allowDiagonal);

        // Identify start and end node
        const startNode = data.find((d) => d.color === gridItemColors.START);
        const endNode = data.find((d) => d.color === gridItemColors.END);

        if (!startNode || !endNode) {
            console.log("startNode / endNode not available!");
            return;
        }

        const startGridItem = gridWithNeighbors[startNode.y][startNode.x];
        const endGridItem = gridWithNeighbors[endNode.y][endNode.x];
        // Start finding the path
        const pathFound = astar(redraw, gridWithNeighbors, startGridItem, endGridItem, speed, gridType, allowDiagonal)
    }

    const reset = () => {
        setData(initialData);
    }

    const findPathTrigger = () => {
        const toClear: string[] = [gridItemColors.OPEN, gridItemColors.CLOSED, gridItemColors.PATH];
        const newData = data.map((d) => {
            const newD = {
                ...d,
                fCost: Infinity,
                gCost: Infinity,
                hCost: Infinity,
            }
            if (toClear.includes(d.color)) {
                return {
                    ...newD,
                    color: gridItemColors.BLANK
                }
            }
            return newD;
        })
        setData(newData);
        setTriggerRunPath(true);
    }

    const redraw = (grid: Array<Array<IGridItem>>) => {
        const flatGrid = flattenDeep(grid);
        setData(flatGrid)
    }

    useEffect(() => {
        if (triggerRunPath === true) {
            setTriggerRunPath(false);
            findPath()
        }
    }, [triggerRunPath, data])

    return (
        <AppContainer>
            <div>
                <Actions
                    setData={setData}
                    showCost={showCost}
                    setShowCost={setShowCost}
                    findPath={findPathTrigger}
                    reset={reset} speed={speed}
                    setSpeed={setSpeed}
                    gridType={gridType}
                    setGridType={setGridType}
                    allowDiagonal={allowDiagonal}
                    setAllowDiagonal={setAllowDiagonal}
                />
                <Legends />
                <Grid showCost={showCost} data={data} setData={setData} gridType={gridType} />
            </div>
        </AppContainer>
    )
}
