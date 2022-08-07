import { useState } from "react";

import styled from "styled-components";
import { SQUARE_SIZE } from "apps/MainApp/data";
import gridItemColors from "theme/grid-item-colors";
import { IGridItem } from "interfaces/IGridItem";

import { useAddDragHandler } from "./useAddDragHandler";

const Container = styled.div`
    display: flex;
    margin-top: 20px; 
`;

type GridProps = {
    width: number;
    height: number;
    data: IGridItem[];
    setData: (data: any) => void;
};

export const Grid = ({ width, height, data, setData }: GridProps) => {
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
                    color: fillColor
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
            <rect
                data-row={d.x}
                data-col={d.y}
                key={i}
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
