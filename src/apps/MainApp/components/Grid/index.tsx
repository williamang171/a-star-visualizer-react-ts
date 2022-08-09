import { useState } from "react";

import GRID_TYPE from "constants/grid-type";
import { IGridItem } from "interfaces/IGridItem";

import SquareGrid from "./SquareGrid";
import HexagonGrid from "./HexagonGrid";
import gridItemColors from "theme/grid-item-colors";

type GridProps = {
    data: IGridItem[];
    setData: (data: any) => void;
    showCost: boolean,
    gridType: GRID_TYPE
};

export const Grid = ({ data, setData, showCost, gridType }: GridProps) => {
    const [isMouseDown, setIsMouseDown] = useState(false);

    const updateGridItem = (e: any) => {
        const target = e.target;
        const currentIsBarrier = target.getAttribute('fill') === gridItemColors.BARRIER;
        const fillColor = currentIsBarrier ? gridItemColors.BLANK : gridItemColors.BARRIER;
        const newData = data.map((d) => {
            if (d.color === gridItemColors.START || d.color === gridItemColors.END) {
                return d;
            }
            if (d.x === parseInt(target.dataset.col) && d.y === parseInt(target.dataset.row)) {
                return {
                    ...d,
                    color: fillColor,
                    fCost: Infinity,
                    gCost: Infinity,
                    hCost: Infinity
                }
            }
            return d;
        })
        setData(newData)
    }

    const handleSvgMouseDown = () => {
        setIsMouseDown(true);
    }

    const handleSvgMouseUp = () => {
        setIsMouseDown(false);
    }

    const handleSvgMouseLeave = () => {
        setIsMouseDown(false);
    }

    const handleMouseDown = (e: any) => {
        updateGridItem(e);
    }

    const handleMouseOver = (e: any,) => {
        if (!isMouseDown) {
            return;
        }
        updateGridItem(e);
    }

    if (gridType === GRID_TYPE.SQUARE) {
        return <SquareGrid data={data} setData={setData} showCost={showCost} />
    }
    if (gridType === GRID_TYPE.HEXAGON) {
        return <HexagonGrid
            handleMouseDown={handleMouseDown}
            handleMouseOver={handleMouseOver}
            handleSvgMouseDown={handleSvgMouseDown}
            handleSvgMouseUp={handleSvgMouseUp}
            handleSvgMouseLeave={handleSvgMouseLeave}
            data={data}
            setData={setData}
        />
    }
    return <div>{`Grid type of ${gridType} not supported.`}</div>
};

export default Grid;
