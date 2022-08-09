import { useState } from "react";

import styled from "styled-components";
import gridItemColors from "theme/grid-item-colors";
import { IGridItem } from "interfaces/IGridItem";
import CostText from "apps/MainApp/components/CostText";

import { useAddDragHandler } from "./useAddDragHandler";
import { SQUARE_SIZE, ROWS, COLS } from "data";

const Container = styled.div`
    display: flex;
    margin-top: 20px; 
`;

type GridProps = {
    data: IGridItem[];
    setData: (data: any) => void;
    showCost: boolean
};

const width = SQUARE_SIZE * ROWS + 2;
const height = SQUARE_SIZE * COLS + 2;

export const Grid = ({ data, setData, showCost }: GridProps) => {
    const [isMouseDown, setIsMouseDown] = useState(false);
    const { dragGridItem } = useAddDragHandler({ data, setData })

    const updateGridItem = (e: any) => {
        const target = e.target;
        const currentIsBarrier = target.getAttribute('fill') === gridItemColors.BARRIER;
        const fillColor = currentIsBarrier ? gridItemColors.BLANK : gridItemColors.BARRIER;
        const newData = data.map((d) => {
            if (d.color === gridItemColors.START || d.color === gridItemColors.END) {
                return d;
            }
            if (d.x === parseInt(target.dataset.row) && d.y === parseInt(target.dataset.col)) {
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

    const handleMousedown = (e: any) => {
        updateGridItem(e);
    }

    const handleMouseOver = (e: any,) => {
        if (!isMouseDown) {
            return;
        }
        updateGridItem(e);
    }

    // Build the rectangles
    const allShapes = data.map((d, i) => {
        return (
            <g key={i} >
                <rect
                    data-row={d.x}
                    data-col={d.y}
                    x={d.x * SQUARE_SIZE}
                    y={d.y * SQUARE_SIZE}
                    width={SQUARE_SIZE}
                    height={SQUARE_SIZE}
                    opacity={1}
                    fill={d.color}
                    stroke={"#ccc"}
                    onMouseDown={handleMousedown}
                    onMouseOver={handleMouseOver}
                />
                <CostText showCost={showCost} d={d} />
            </g>
        );
    });

    return (
        <Container>
            <svg width={width} height={height}>
                <g
                    width={width}
                    height={height}
                    onMouseDown={handleSvgMouseDown}
                    onMouseUp={handleSvgMouseUp}
                    onMouseLeave={handleSvgMouseLeave}
                >
                    {allShapes}
                    <rect
                        id={dragGridItem.id}
                        key={dragGridItem.key}
                        opacity={dragGridItem.opacity}
                        fill={dragGridItem.fill}
                        width={dragGridItem.width}
                        height={dragGridItem.height}
                        x={dragGridItem.x}
                        y={dragGridItem.y}
                    />
                </g>
            </svg>
        </Container>
    );
};

export default Grid;
