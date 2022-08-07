import { useState } from "react";
import { cloneDeep } from "lodash";

import Grid from "apps/MVPApp/components/Grid";
import colors from "theme/grid-item-colors";
import { algorithm } from "apps/MVPApp/algorithms/astar/astar";
import { useAstarStep } from "apps/MVPApp/algorithms/astar/use-astar-step"
import { generateGrid } from "apps/MVPApp/helpers/generate-grid";
import { updateGridWithNeighbors } from "helpers/update-grid-with-neighbors";
import { TOTAL_COLS, TOTAL_ROWS } from "apps/MVPApp/configs/grid-configs";
import { Title, Container, Button, ButtonsContainer, AppContainer } from "apps/MVPApp/components/styled";

const g = generateGrid(TOTAL_ROWS, TOTAL_COLS)

function App() {
    const [grid, setGrid] = useState(cloneDeep(g));
    const [startGridItemIndex, setStartGridItemIndex] = useState([0, 0]);
    const [endGridItemIndex, setEndGridItemIndex] = useState([0, 0]);
    const [selectedStart, setSelectedStart] = useState(false);
    const [selectedEnd, setSelectedEnd] = useState(false);

    const { startStep, started, nextStep } = useAstarStep()

    const handleClick = (x: number, y: number) => {
        const newGrid = [...grid];
        if (!selectedStart) {
            newGrid[y][x].color = colors.START;
            setGrid(newGrid);
            setSelectedStart(true);
            setStartGridItemIndex([y, x])
            return;
        }
        if (!selectedEnd) {
            newGrid[y][x].color = colors.END;
            setGrid(newGrid);
            setSelectedEnd(true);
            setEndGridItemIndex([y, x])
            return;
        }
        newGrid[y][x].color = colors.BARRIER;
        setGrid(newGrid);
    }

    const handleRun = () => {
        if (!selectedStart || !selectedEnd) {
            alert("Please select a start node and an end node");
            return;
        }
        const gridWithNeighbors = updateGridWithNeighbors(grid, TOTAL_ROWS, TOTAL_COLS);
        const startGridItem = gridWithNeighbors[startGridItemIndex[0]][startGridItemIndex[1]];
        const endGridItem = gridWithNeighbors[endGridItemIndex[0]][endGridItemIndex[1]];
        algorithm(setGrid, gridWithNeighbors, startGridItem, endGridItem)
    }

    const clearGrid = () => {
        setGrid(generateGrid(TOTAL_ROWS, TOTAL_COLS))
        setSelectedStart(false);
        setSelectedEnd(false);
    }

    const onNext = () => {
        const gridWithNeighbors = updateGridWithNeighbors(grid, TOTAL_ROWS, TOTAL_COLS);
        const startGridItem = gridWithNeighbors[startGridItemIndex[0]][startGridItemIndex[1]];
        const endGridItem = gridWithNeighbors[endGridItemIndex[0]][endGridItemIndex[1]];
        if (started) {
            nextStep(setGrid, grid, startGridItem, endGridItem)
            return;
        }
        startStep(setGrid, gridWithNeighbors, startGridItem, endGridItem);
    }

    return (
        <AppContainer>
            <Container>
                <Title>A* Pathfinding</Title>
            </Container>
            <Container>
                <Grid grid={grid} gridItemOnClick={handleClick} />
            </Container>
            <Container>
                <ButtonsContainer>
                    <Button type="button" onClick={handleRun}>Find Path</Button>
                    <span style={{ marginRight: "10px" }} />
                    <Button type="button" onClick={onNext}>Next Step</Button>
                    <span style={{ marginRight: "10px" }} />
                    <Button type="button" onClick={clearGrid}>Reset</Button>
                </ButtonsContainer>
            </Container>
        </AppContainer>

    );
}

export default App;
