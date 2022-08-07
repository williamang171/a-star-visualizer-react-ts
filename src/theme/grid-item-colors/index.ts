import { LooseObject } from "interfaces/LooseObject";

export const START = '#42a5f5'; // dark blue
export const CLOSED = '#d32f2f'; // red
export const OPEN = '#388e3c'; // green
export const BARRIER = '#63666A'; // dark grey
export const END = '#f57c00'; // orange
export const PATH = '#ab47bc'; // purple
export const BLANK = '#fff'; // white

export default {
    START,
    CLOSED,
    OPEN,
    BARRIER,
    END,
    PATH,
    BLANK
};

export const colorsList = [
    {
        color: START,
        text: "Start"
    },
    {
        color: END,
        text: "End"
    },
    {
        color: BARRIER,
        text: "Barrier"
    },
    {
        color: CLOSED,
        text: "Closed"
    },
    {
        color: PATH,
        text: "Path"
    },
    {
        color: OPEN,
        text: "Open"
    },
    {
        color: BLANK,
        text: "Blank"
    }
];
