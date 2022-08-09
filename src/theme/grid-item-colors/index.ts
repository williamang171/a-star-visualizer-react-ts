import { red, green, grey, orange, purple, blue } from "@mui/material/colors";

export const START = blue[500]; // dark blue
export const CLOSED = red[500]; // red
export const OPEN = green[500]; // green
export const BARRIER = grey[800]; // dark grey
export const END = orange[500]; // orange
export const PATH = purple[500]; // purple
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
