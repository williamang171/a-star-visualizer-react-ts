import { useState } from "react";

import GRID_TYPE from "constants/grid-type";
import { IGridItem } from "interfaces/IGridItem";

import SquareGrid from "./SquareGrid";
import HexagonGrid from "./HexagonGrid";
import gridItemColors from "theme/grid-item-colors";

type GridProps = {
    data: IGridItem[];
    setData: (data: IGridItem[]) => void;
    showCost: boolean,
    gridType: GRID_TYPE,
};

export const Grid = ({ data, setData, showCost, gridType }: GridProps) => {
    const [isMouseDown, setIsMouseDown] = useState(false);

    const updateGridItem = (e: React.MouseEvent<SVGElement>) => {
        const target = e.target as SVGElement;
        const currentIsBarrier = target.getAttribute('fill') === gridItemColors.BARRIER;
        const fillColor = currentIsBarrier ? gridItemColors.BLANK : gridItemColors.BARRIER;
        const newData = data.map((d) => {
            if (d.color === gridItemColors.START || d.color === gridItemColors.END) {
                return d;
            }
            if (d.x === parseInt(target.dataset.col ?? '', 10) && d.y === parseInt(target.dataset.row ?? '', 10)) {
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

    const handleMouseDown = (e: React.MouseEvent<SVGElement>) => {
        updateGridItem(e);
    }

    const handleMouseOver = (e: React.MouseEvent<SVGElement>) => {
        if (!isMouseDown) {
            return;
        }
        updateGridItem(e);
    }

    if (gridType === GRID_TYPE.SQUARE) {
        return <SquareGrid
            handleMouseDown={handleMouseDown}
            handleMouseOver={handleMouseOver}
            handleSvgMouseDown={handleSvgMouseDown}
            handleSvgMouseUp={handleSvgMouseUp}
            handleSvgMouseLeave={handleSvgMouseLeave}
            data={data}
            setData={setData}
            showCost={showCost} />
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
