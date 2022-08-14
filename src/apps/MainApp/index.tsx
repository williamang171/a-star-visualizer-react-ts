import { ReactEventHandler, useEffect } from 'react'
import styled from "styled-components";
import flattenDeep from "lodash/flattenDeep";

import Legends from 'components/Legends';
import { IGridItem } from 'interfaces/IGridItem';
import gridItemColors from 'theme/grid-item-colors';
import { updateGridWithNeighbors } from 'helpers/update-grid-with-neighbors';
import { astar } from "algorithms/astar";

import Actions from './components/Actions';
import Grid from "./components/Grid";
import { ROWS, COLS } from "data/grid-settings";

import useAppState from './hooks/useAppState';

const AppContainer = styled.div` 
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex-wrap: wrap;
    min-width: 800px;
`;

const PreventEventPropogationMask = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    background: red;
    zIndex: 1000;
    opacity: 0;

    :hover {
        cursor:not-allowed
    }
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
        setAllowDiagonal,
        resetGrid,
        findingPath,
        setFindingPath
    } = useAppState();

    const findPath = async () => {

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
        const pathFound = await astar(redraw, gridWithNeighbors, startGridItem, endGridItem, speed, gridType, allowDiagonal)
        setFindingPath(false);
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
            setFindingPath(true);
            setTriggerRunPath(false);
            findPath()
        }
    }, [triggerRunPath, data])

    const handleAppContainerClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
    }

    return (
        <AppContainer>
            {findingPath ? <PreventEventPropogationMask onClick={handleAppContainerClick} /> : null}
            <div>
                <Actions
                    disabled={findingPath}
                    setData={setData}
                    showCost={showCost}
                    setShowCost={setShowCost}
                    findPath={findPathTrigger}
                    reset={resetGrid} speed={speed}
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
