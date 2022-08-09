import { useState } from "react";

import GRID_TYPE from "constants/grid-type";
import { SPEED } from "constants/speed";
import { data as initialData, SQUARE_SIZE, ROWS, COLS } from "data";

export default function useAppState() {
    const [speed, setSpeed] = useState(SPEED.FAST);
    const [data, setData] = useState(initialData);
    const [showCost, setShowCost] = useState(false);
    const [gridType, setGridType] = useState(GRID_TYPE.SQUARE);
    const [triggerRunPath, setTriggerRunPath] = useState(false);

    return {
        speed,
        setSpeed,
        showCost,
        setShowCost,
        gridType,
        setGridType,
        triggerRunPath, setTriggerRunPath,
        data,
        setData
    }
}