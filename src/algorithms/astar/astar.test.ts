import { describe, expect, it } from 'vitest'

import { astar } from 'algorithms/astar'
import GRID_TYPE from 'constants/grid-type'
import { SPEED } from 'constants/speed'
import { generateData } from 'helpers/generate-data'
import { updateGridWithNeighborsSquare } from 'helpers/update-grid-with-neighbors/square'
import { IGridItem } from 'interfaces/IGridItem'
import gridItemColors from 'theme/grid-item-colors'

function makeGrid(rows: number, cols: number): Array<Array<IGridItem>> {
  const grid: Array<Array<IGridItem>> = Array.from({ length: rows }, () => [])
  for (const item of generateData(rows, cols)) {
    grid[item.y][item.x] = item
  }
  return grid
}

describe('astar', () => {
  it('finds a path between two open cells', async () => {
    const rows = 5
    const cols = 5
    const grid = updateGridWithNeighborsSquare(
      makeGrid(rows, cols),
      rows,
      cols,
      true
    )

    const found = await astar(
      () => undefined,
      grid,
      grid[0][0],
      grid[rows - 1][cols - 1],
      SPEED.IMMEDIATE,
      GRID_TYPE.SQUARE,
      true
    )

    expect(found).toBe(true)
  })

  it('returns false when the target is walled off', async () => {
    const rows = 3
    const cols = 3
    const rawGrid = makeGrid(rows, cols)

    // Full wall on the middle column.
    rawGrid[0][1].color = gridItemColors.BARRIER
    rawGrid[1][1].color = gridItemColors.BARRIER
    rawGrid[2][1].color = gridItemColors.BARRIER

    const grid = updateGridWithNeighborsSquare(rawGrid, rows, cols, false)

    const found = await astar(
      () => undefined,
      grid,
      grid[0][0],
      grid[0][2],
      SPEED.IMMEDIATE,
      GRID_TYPE.SQUARE,
      false
    )

    expect(found).toBe(false)
  })
})
