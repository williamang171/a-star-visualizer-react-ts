import { useEffect } from 'react'
import styled from "styled-components";
import flattenDeep from "lodash/flattenDeep";

import Legends from 'components/Legends';
import { IGridItem } from 'interfaces/IGridItem';
import gridItemColors from 'theme/grid-item-colors';
import { updateGridWithNeighbors } from 'helpers/update-grid-with-neighbors';
import { updateGridWithNeighbors as updateGridWithNeighborsHexagon } from 'helpers/update-grid-with-neighbors-hexagon';
import { astar } from "algorithms/astar";

import Actions from './components/Actions';
import Grid from "./components/Grid";
// import { data as initialData, ROWS, COLS } from "data/square-grid";
import { initialData, ROWS, COLS } from 'data/hexagon-grid';

import useAppState from './hooks/useAppState';
import GRID_TYPE from 'constants/grid-type';

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
        setData } = useAppState();

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
        const gridWithNeighbors = gridType === GRID_TYPE.HEXAGON ? updateGridWithNeighborsHexagon(grid, ROWS, COLS) : updateGridWithNeighbors(grid, ROWS, COLS);

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
        const pathFound = astar(redraw, gridWithNeighbors, startGridItem, endGridItem, speed)
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
                    setGridType={setGridType} />
                <Legends />
                <Grid showCost={showCost} data={data} setData={setData} gridType={gridType} />
            </div>
        </AppContainer>
    )
}
