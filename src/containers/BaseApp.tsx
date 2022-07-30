import { useState } from "react";
import { cloneDeep } from "lodash";

import Grid from "components/Grid";
import colors from "configs/colors";
import { algorithm } from "algorithms/astar/astar";
import { useAstarStep } from "algorithms/astar/use-astar-step"
import { generateGrid } from "helpers/generate-grid";
import { updateGridWithNeighbors } from "helpers/update-grid-with-neighbors";
import { TOTAL_COLS, TOTAL_ROWS } from "configs/grid-configs";
import { Title, Container, Button, ButtonsContainer } from "components/styled";

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
        const gridWithNeighbors = updateGridWithNeighbors(grid);
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
        const gridWithNeighbors = updateGridWithNeighbors(grid);
        const startGridItem = gridWithNeighbors[startGridItemIndex[0]][startGridItemIndex[1]];
        const endGridItem = gridWithNeighbors[endGridItemIndex[0]][endGridItemIndex[1]];
        if (started) {
            nextStep(setGrid, grid, startGridItem, endGridItem)
            return;
        }
        startStep(setGrid, gridWithNeighbors, startGridItem);
        // nextStep(setGrid, gridWithNeighbors, startGridItem, endGridItem)
    }

    return (
        <div>
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
        </div>

    );
}

export default App;
