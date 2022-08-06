import { useState, useMemo, useEffect } from "react";
import * as d3 from "d3";

import styled from "styled-components";
import { SQUARE_SIZE } from "apps/MainAppV2/data";
import gridItemColors from "theme/grid-item-colors";
import { IGridItem } from "apps/BaseApp/interfaces/IGridItem";

const Container = styled.div`
    display: flex;
    margin-top: 20px; 
`;

type GridProps = {
    width: number;
    height: number;
    data: IGridItem[];
    setHoveredCell: (hoveredCell: HoveredCell | null) => void;
    setData: (data: any) => void;
};

export type HoveredCell = {
    xLabel: string;
    yLabel: string;
    xPos: number;
    yPos: number;
};

export const Grid = ({ width, height, data, setHoveredCell, setData }: GridProps) => {
    const [isMouseDown, setIsMouseDown] = useState(false);

    const updateGridItem = (e: any) => {
        const target = e.target;

        const fillColor = gridItemColors.BARRIER;
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

    const handleSvgMousedown = () => {
        setIsMouseDown(true);
    }

    const handleSvgMouseup = () => {
        setIsMouseDown(false);
    }

    const handleMousedown = (e: any) => {
        updateGridItem(e);
    }

    const handleMouseClick = (e: any) => {
        updateGridItem(e);
    }

    const handleMouseOver = (e: any,) => {
        if (!isMouseDown) {
            return;
        }
        updateGridItem(e);
    }

    const addHandleDrag = (latestStartNode: IGridItem) => {
        console.log(latestStartNode)
        const handleDrag = d3.drag().on('drag', function (event) {
            const me = d3.select("#for-dnd");
            me.attr("opacity", 1);
            me.attr('x', event.x);
            me.attr('y', event.y);
        }).on('end', function (event) {
            let closestNode: IGridItem | null = null;
            let currentClosestRange = Infinity;
            data.forEach((d) => {
                const diff = (Math.abs((event.x / 30) - d.x) + Math.abs((event.y / 30) - d.y));
                if (diff < currentClosestRange) {
                    closestNode = d;
                    currentClosestRange = diff;
                }
            })
            const newData = data.map((d) => {
                const isClosestNode = closestNode && d.x === closestNode.x && closestNode.y === d.y;
                if (isClosestNode) {
                    return {
                        ...d,
                        color: gridItemColors.START
                    }
                }
                if (d.color === gridItemColors.START && !isClosestNode) {
                    return {
                        ...d,
                        color: gridItemColors.BLANK
                    }
                }
                return d;
            })
            setData(newData)
            const me = d3.select("#for-dnd");
            me.attr("opacity", 0)
            me.attr("x", 99999);
            me.attr('y', 99999)
            // d3.select(this).on('mousedown.drag', null);
        });
        // const node = ReactDOM.findDOMNode(this);
        console.log(d3.select(`rect[fill='${gridItemColors.START}']`))
        handleDrag(d3.select(`rect[data-row='${latestStartNode.x}'][data-col='${latestStartNode.y}']`));
        // handleDrag(d3.select(`rect[fill='${gridItemColors.END}']`))
    }

    const latestStartNode = useMemo(() => {
        return data.find((d) => {
            return d.color === gridItemColors.START
        })
    }, [data])

    useEffect(() => {
        if (latestStartNode) {
            addHandleDrag(latestStartNode);
        }
    }, [latestStartNode])

    // Build the rectangles
    const allShapes = data.map((d, i) => {
        return (
            <rect
                onClick={handleMouseClick}
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
                onMouseEnter={(e) => {
                    setHoveredCell({
                        xLabel: "" + d.x,
                        yLabel: "" + d.y,
                        xPos: d.x * SQUARE_SIZE,
                        yPos: d.y * SQUARE_SIZE,
                    });
                }}
                onMouseOver={handleMouseOver}
                onMouseLeave={() => setHoveredCell(null)}
            />
        );
    });

    return (
        <Container>
            <svg width={width} height={height}>
                <g
                    width={width}
                    height={height}
                    onMouseDown={handleSvgMousedown}
                    onMouseUp={handleSvgMouseup}
                >
                    {allShapes}
                    <rect
                        id="for-dnd"
                        key={"for-dnd"}
                        opacity={1}
                        fill={gridItemColors.START}
                        width={SQUARE_SIZE}
                        height={SQUARE_SIZE}
                        x={99999}
                        y={99999}
                    />
                </g>
            </svg>
        </Container>
    );
};

export default Grid;
