import styled from "styled-components";
import flattenDeep from "lodash/flattenDeep";
import { grey, pink } from "@mui/material/colors";

import { IGridItem } from "interfaces/IGridItem";
import CostText from "apps/MainApp/components/CostText";
import { useAddDragHandler } from "apps/MainApp/hooks/useAddDragHandler";
import { SQUARE_SIZE } from "data/square-grid";
import { ROWS, COLS } from "data/grid-settings";
import { identifyNeighbours } from "helpers/update-grid-with-neighbors/square";

const Container = styled.div`
    display: flex;
    margin-top: 20px;
    justify-content: center;
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

    const drawNeighbors = (event: React.MouseEvent<SVGPathElement>) => {
        const row = event.currentTarget.attributes.getNamedItem('data-row')?.value;
        const col = event.currentTarget.attributes.getNamedItem('data-col')?.value;
        console.log(`Current row: ${row}, Current col: ${col}`)
        if (!row || !col) {
            return;
        }
        const currentGridItem = data.find((d) => d.x === parseInt(col) && d.y === parseInt(row));
        if (!currentGridItem) {
            return;
        }
        // Identify neighbours
        const newGrid: Array<Array<IGridItem>> = [];
        data.forEach((d) => {
            if (!newGrid[d.y]) {
                newGrid[d.y] = [];
            }
            newGrid[d.y].push(d)
        })
        const ns = identifyNeighbours(newGrid, currentGridItem, ROWS, COLS);
        ns.forEach((n) => {
            newGrid[n.y][n.x].color = pink[300];
        })
        console.log(ns);
        const flatGrid = flattenDeep(newGrid);
        // console.log(flatGrid);
        setData(flatGrid)
    }

    const handleClick = (event: React.MouseEvent<SVGPathElement>) => {
        drawNeighbors(event)
    }

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
                    stroke={grey[500]}
                    onMouseDown={handleMouseDown}
                    onMouseOver={handleMouseOver}
                    className="grid-item"
                // onClick={handleClick}
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
