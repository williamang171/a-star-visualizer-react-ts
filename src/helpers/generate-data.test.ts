import { describe, expect, it } from 'vitest'

import { generateData, getFillColor } from 'helpers/generate-data'
import { COLS, ROWS } from 'data/grid-settings'
import gridItemColors from 'theme/grid-item-colors'

describe('generateData', () => {
  const data = generateData(ROWS, COLS)

  it('creates one item per cell', () => {
    expect(data).toHaveLength(ROWS * COLS)
  })

  it('assigns a unique id to every cell', () => {
    expect(new Set(data.map((d) => d.id)).size).toBe(ROWS * COLS)
  })

  it('places the start and end nodes', () => {
    expect(getFillColor(3, 3)).toBe(gridItemColors.START)
    expect(getFillColor(COLS - 4, ROWS - 4)).toBe(gridItemColors.END)
    expect(getFillColor(0, 0)).toBe(gridItemColors.BLANK)

    expect(data.find((d) => d.color === gridItemColors.START)).toMatchObject({
      x: 3,
      y: 3,
    })
    expect(data.find((d) => d.color === gridItemColors.END)).toMatchObject({
      x: COLS - 4,
      y: ROWS - 4,
    })
  })

  it('assigns hexagon coordinates', () => {
    const row0 = data.filter((d) => d.y === 0)
    expect(row0[0]).toMatchObject({ hexX: 0, hexY: 0, hexZ: 0 })
    expect(row0[1]).toMatchObject({ hexX: 1, hexY: 0, hexZ: -1 })

    const row1 = data.filter((d) => d.y === 1)
    expect(row1[0]).toMatchObject({ hexX: 0, hexY: 1, hexZ: -1 })
  })
})
