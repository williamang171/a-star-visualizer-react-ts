import * as d3 from "d3";

import { generateData } from "helpers/generate-data";

//SVG sizes and margins
export const margin = {
    top: 50,
    right: 20,
    bottom: 20,
    left: 50
};
export const width = 850;
export const height = 500;

//The number of columns and rows of the heatmap
export const COLS = 30;
export const ROWS = 20;

//The maximum radius the hexagons can have to still fit the screen
export const hexRadius = d3.min([width / ((COLS + 0.5) * Math.sqrt(3)),
height / ((ROWS + 1 / 3) * 1.5)]) || 0;

export const initialData = generateData(ROWS, COLS);
export const svgWidth = width + margin.left + margin.right;
export const svgHeight = height + margin.top + margin.bottom;
export const gTransform = `translate(${margin.left},${margin.top})`
