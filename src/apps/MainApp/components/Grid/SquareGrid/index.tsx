import styled from "styled-components";

import { IGridItem } from "interfaces/IGridItem";
import CostText from "apps/MainApp/components/CostText";
import { useAddDragHandler } from "apps/MainApp/hooks/useAddDragHandler";
import { SQUARE_SIZE, ROWS, COLS } from "data/square-grid";

const Container = styled.div`
    display: flex;
    margin-top: 20px; 
`;

type GridProps = {
    data: IGridItem[];
    setData: (data: any) => void;
    showCost: boolean,
    handleSvgMouseDown: () => void;
    handleSvgMouseUp: () => void;
    handleMouseDown: (e: any) => void;
    handleMouseOver: (e: any) => void;
    handleSvgMouseLeave: () => void;
};

const width = SQUARE_SIZE * COLS + 2;
const height = SQUARE_SIZE * ROWS + 2;

export const Grid = ({ data, setData, showCost, handleMouseDown, handleMouseOver, handleSvgMouseDown, handleSvgMouseLeave, handleSvgMouseUp }: GridProps) => {

    const computeClosestNode = (event: any) => {
        let closestNode: IGridItem | null = null;
        let currentClosestRange = Infinity;
        data.forEach((d) => {
            const diff = (Math.abs((event.x / SQUARE_SIZE) - d.x) + Math.abs((event.y / SQUARE_SIZE) - d.y));
            if (diff < currentClosestRange) {
                closestNode = d;
                currentClosestRange = diff;
            }
        })
        return closestNode;
    }

    const { dragGridItem } = useAddDragHandler({ data, setData, computeClosestNode: computeClosestNode })

    // Build the rectangles
    const allShapes = data.map((d, i) => {
        return (
            <g key={i} >
                <rect
                    data-row={d.y}
                    data-col={d.x}
                    x={d.x * SQUARE_SIZE}
                    y={d.y * SQUARE_SIZE}
                    width={SQUARE_SIZE}
                    height={SQUARE_SIZE}
                    opacity={1}
                    fill={d.color}
                    stroke={"#ccc"}
                    onMouseDown={handleMouseDown}
                    onMouseOver={handleMouseOver}
                    className="grid-item"
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
