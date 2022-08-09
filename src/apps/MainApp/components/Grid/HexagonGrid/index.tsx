import React, { useMemo } from 'react'
import * as d3Hexbin from "d3-hexbin";
import { pink, grey } from '@mui/material/colors';
import flattenDeep from "lodash/flattenDeep";

import { svgHeight, svgWidth, gTransform, hexRadius } from "data/hexagon-grid";
import { ROWS, COLS } from "data/hexagon-grid";
import { useAddDragHandler } from "apps/MainApp/hooks/useAddDragHandler";
import { IGridItem } from 'interfaces/IGridItem';
import { identifyNeighbours } from 'helpers/update-grid-with-neighbors-hexagon';

const hexbin = d3Hexbin.hexbin().radius(hexRadius);

interface Props {
    handleSvgMouseDown: () => void;
    handleSvgMouseUp: () => void;
    handleMouseDown: (e: any) => void;
    handleMouseOver: (e: any) => void;
    handleSvgMouseLeave: () => void;
    data: IGridItem[];
    setData: (data: any) => void;
}

export default function HexagonGrid(props: Props) {
    const { handleSvgMouseDown, handleSvgMouseUp, handleMouseDown, handleMouseOver, handleSvgMouseLeave, data, setData } = props;

    console.log(data)

    const generatedPoints = useMemo(() => {
        const points: [number, number][] = [];
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                let x = hexRadius * j * Math.sqrt(3)
                //Offset each uneven row by half of a "hex-width" to the right
                if (i % 2 === 1) x += (hexRadius * Math.sqrt(3)) / 2
                const y = hexRadius * i * 1.5
                points.push([x, y])
            }//for j
        }//for i 
        return points
    }, [data])

    const computeClosestNode = (event: any) => {
        let closestNode: IGridItem | null = null;
        let currentClosestRange = Infinity;

        generatedPoints.forEach((d, i) => {
            const diff = (Math.abs((event.x) - d[0]) + Math.abs((event.y) - d[1]));
            if (diff < currentClosestRange) {
                closestNode = data[i];
                currentClosestRange = diff;
            }
        })
        return closestNode;
    }

    const { dragGridItem } = useAddDragHandler({ data, setData, computeClosestNode: computeClosestNode })

    const dragGridItemPoints: [number, number][] = useMemo(() => {
        return [
            [dragGridItem.x, dragGridItem.y]
        ]
    }, [dragGridItem])

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
        const flatGrid = flattenDeep(newGrid);
        // console.log(flatGrid);
        setData(flatGrid)
    }

    const handleMouseClick = (event: React.MouseEvent<SVGPathElement>) => {
        // For debugging if identify neighbors correctly
        // drawNeighbors(event);
    }

    console.log(dragGridItemPoints)

    return (
        <div>
            <svg width={svgWidth} height={svgHeight}>
                <g transform={gTransform} onMouseDown={handleSvgMouseDown}
                    onMouseUp={handleSvgMouseUp}
                    onMouseLeave={handleSvgMouseLeave}>
                    <g>
                        {hexbin(generatedPoints).map((p, i) => {
                            return <path
                                id={`${p.y}-${p.x}`}
                                key={`${p.y}-${p.x}`}
                                onClick={handleMouseClick}
                                className='grid-item'
                                stroke={grey[500]}
                                strokeWidth={1}
                                fill={data[i].color}
                                d={`M${p.x},${p.y}${hexbin.hexagon()}`}
                                data-row={data[i].y}
                                data-col={data[i].x}
                                onMouseDown={handleMouseDown}
                                onMouseOver={handleMouseOver} />
                        })}
                    </g>
                    {/* <rect
                        id={dragGridItem.id}
                        key={dragGridItem.key}
                        opacity={dragGridItem.opacity}
                        fill={dragGridItem.fill}
                        width={dragGridItem.width}
                        height={dragGridItem.height}
                        x={dragGridItem.x}
                        y={dragGridItem.y}
                    /> */}
                    {hexbin(dragGridItemPoints).map((p, i) => {
                        return <path
                            id={dragGridItem.id}
                            key={dragGridItem.id}
                            stroke={grey[500]}
                            strokeWidth={1}
                            fill={dragGridItem.fill}
                            d={`M${p.x},${p.y}${hexbin.hexagon()}`} />
                    })}
                </g>
            </svg>
        </div>
    )
}
