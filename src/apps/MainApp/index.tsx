import { useEffect, useState } from 'react'
import styled from "styled-components";
import _ from "lodash";

import Legends from 'components/Legends';
import { IGridItem } from 'interfaces/IGridItem';

import { algorithm } from "./algorithms/astar/astar";
import { updateGridWithNeighbors } from 'helpers/update-grid-with-neighbors';
import Actions from './components/Actions';
import Grid from "./components/Grid";
import { data as initialData, SQUARE_SIZE, ROWS, COLS } from "./data";
import gridItemColors from 'theme/grid-item-colors';
import { SPEED } from 'configs/speed';

const width = SQUARE_SIZE * ROWS + 2;
const height = SQUARE_SIZE * COLS + 2;

const AppContainer = styled.div` 
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 100vh;
    flex-wrap: wrap;
`;

export default function MainApp() {
    const [speed, setSpeed] = useState(SPEED.FAST);
    const [data, setData] = useState(initialData);
    const [showCost, setShowCost] = useState(false);
    const [triggerRunPath, setTriggerRunPath] = useState(false);

    const findPath = () => {
        // Transform grid[] to grid[][] 
        const grid: Array<Array<IGridItem>> = [];
        data.forEach((d) => {
            if (grid.length <= d.y) {
                grid.push([]);
            }
            grid[d.y].push(d)
        })
        const gridWithNeighbors = updateGridWithNeighbors(grid, ROWS, COLS);
        const startNode = data.find((d) => d.color === gridItemColors.START);
        const endNode = data.find((d) => d.color === gridItemColors.END);
        if (startNode && endNode) {
            const startGridItem = gridWithNeighbors[startNode.y][startNode.x];
            const endGridItem = gridWithNeighbors[endNode.y][endNode.x];
            const pathFound = algorithm(redraw, gridWithNeighbors, startGridItem, endGridItem, speed)
        }
        else {
            console.log("startNode and endNode not available!");
        }
    }

    useEffect(() => {
        if (triggerRunPath === true) {
            setTriggerRunPath(false);
            findPath()
        }
    }, [triggerRunPath, data])

    const reset = () => {
        setData(initialData);
    }

    const findPathTrigger = () => {
        const toClear = [gridItemColors.OPEN, gridItemColors.CLOSED, gridItemColors.PATH];
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
        const flatGrid = _.flattenDeep(grid);
        setData(flatGrid)
    }

    return (
        <AppContainer>
            <div>
                <Actions showCost={showCost} setShowCost={setShowCost} findPath={findPathTrigger} reset={reset} speed={speed} setSpeed={setSpeed} />
                <Legends />
                <Grid showCost={showCost} data={data} setData={setData} width={width} height={height} />
            </div>
        </AppContainer>
    )
}
