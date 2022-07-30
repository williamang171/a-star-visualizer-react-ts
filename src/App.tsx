import { useState } from "react";
import styled from "styled-components";

import Grid from "./components/Grid";
import colors from "./configs/colors";

import { IGridItem } from "interfaces/IGridItem";
import { algorithm } from "./algorithm";
import { cloneDeep } from "lodash";

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
`;

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid #007fff;
  color: #007fff; 
  padding: 0.25em 1em;
`

const ButtonsContainer = styled.div`
  margin-top: 20px;
  display: flex;
`;

const Title = styled.div`
  padding: 20px;
  font-size: 1.5em;
`;

const generateGrid = (rows: number, cols: number) => {
  let grid = [];
  for (let i = 0; i < rows; i++) {
    let elements: Array<IGridItem> = [];
    for (let j = 0; j < cols; j++) {
      elements.push({
        x: i,
        y: j,
        id: `x${i}y${j}`,
        color: "#fff",
        fCost: Infinity,
        gCost: Infinity,
        neighbors: []
      })
    }
    grid.push(elements)
  }
  return grid;
}

const TOTAL_ROWS = 8;
const TOTAL_COLS = 8;
const g = generateGrid(TOTAL_ROWS, TOTAL_COLS)

function App() {
  const [grid, setGrid] = useState(cloneDeep(g));
  const [startGridItemIndex, setStartGridItemIndex] = useState([0, 0]);
  const [endGridItemIndex, setEndGridItemIndex] = useState([0, 0]);
  const [selectedStart, setSelectedStart] = useState(false);
  const [selectedEnd, setSelectedEnd] = useState(false);

  const handleClick = (x: number, y: number) => {
    const newGrid = [...grid];
    if (!selectedStart) {
      newGrid[x][y].color = colors.START;
      setGrid(newGrid);
      setSelectedStart(true);
      setStartGridItemIndex([x, y])
      return;
    }
    if (!selectedEnd) {
      newGrid[x][y].color = colors.END;
      setGrid(newGrid);
      setSelectedEnd(true);
      setEndGridItemIndex([x, y])
      return;
    }
    newGrid[x][y].color = colors.BARRIER;
    setGrid(newGrid);
  }

  const getGridWithNeighbors = () => {
    const newGrid = cloneDeep(grid);
    newGrid.forEach((row) => {
      row.forEach((item) => {
        const n: Array<any> = [];
        const { x, y } = item;

        // Down
        if (y + 1 < TOTAL_ROWS && grid[x][y + 1].color !== colors.BARRIER) {
          n.push(grid[x][y + 1])
        }

        // Up
        if (y - 1 >= 0 && grid[x][y - 1].color !== colors.BARRIER) {
          n.push(grid[x][y - 1])
        }

        // Right
        if (x + 1 < TOTAL_COLS && grid[x + 1][y].color !== colors.BARRIER) {
          n.push(grid[x + 1][y])
        }

        // Left
        if (x - 1 > 0 && grid[x - 1][y].color !== colors.BARRIER) {
          n.push(grid[x - 1][y])
        }

        item.neighbors = n;
      })
    })
    return newGrid;
  }

  const handleRun = () => {
    if (!selectedStart) {
      alert("Please select a start node");
      return;
    }
    if (!selectedEnd) {
      alert("Please select an end node");
      return;
    }
    const gridWithNeighbors = getGridWithNeighbors();
    const startGridItem = gridWithNeighbors[startGridItemIndex[0]][startGridItemIndex[1]];
    const endGridItem = gridWithNeighbors[endGridItemIndex[0]][endGridItemIndex[1]];
    algorithm(setGrid, gridWithNeighbors, startGridItem, endGridItem)
  }

  const clearGrid = () => {
    setGrid(g)
  }

  console.log(grid)

  return (
    <div>
      <Container>
        <Title>A * Pathfinding</Title>
      </Container>
      <Container>
        <Grid grid={grid} gridItemOnClick={handleClick} />
      </Container>
      <Container>
        <ButtonsContainer>
          <Button type="button" onClick={handleRun}>Run</Button>
          <span style={{ marginRight: "10px" }} />
          <Button type="button" onClick={clearGrid}>Clear</Button>
        </ButtonsContainer>
      </Container>
    </div>

  );
}

export default App;
