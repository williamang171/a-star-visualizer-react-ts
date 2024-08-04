import { useState, useCallback } from "react";

import GRID_TYPE from "constants/grid-type";
import { SPEED } from "constants/speed";
import { ROWS, COLS } from "data/grid-settings";
import { generateData } from "helpers/generate-data";

const initialData = generateData(ROWS, COLS);

export default function useAppState() {
    const [speed, setSpeed] = useState(SPEED.FAST);
    const [data, setData] = useState(initialData);
    const [showCost, setShowCost] = useState(false);
    const [gridType, setGridType] = useState(GRID_TYPE.SQUARE);
    const [triggerRunPath, setTriggerRunPath] = useState(false);
    const [allowDiagonal, setAllowDiagonal] = useState(true);
    const [findingPath, setFindingPath] = useState(false);

    const resetGrid = useCallback(() => {
        setData(initialData)
    }, [setData])

    return {
        speed,
        setSpeed,
        showCost,
        setShowCost,
        gridType,
        setGridType,
        triggerRunPath, setTriggerRunPath,
        data,
        setData,
        allowDiagonal,
        setAllowDiagonal,
        resetGrid,
        findingPath,
        setFindingPath
    }
}