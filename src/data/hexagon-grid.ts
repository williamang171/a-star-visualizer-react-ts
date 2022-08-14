import * as d3 from "d3";
import { ROWS, COLS } from "./grid-settings";

//SVG sizes and margins
export const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 80
};
export const width = 700;
export const height = 550;

//The maximum radius the hexagons can have to still fit the screen
export const hexRadius = d3.min([width / ((COLS + 0.5) * Math.sqrt(3)),
height / ((ROWS + 1 / 3) * 1.5)]) || 0;


export const svgWidth = width + margin.left + margin.right;
export const svgHeight = height + margin.top + margin.bottom;
export const gTransform = `translate(${margin.left},${margin.top})`
