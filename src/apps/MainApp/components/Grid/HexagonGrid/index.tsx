import React, { useMemo } from 'react'
import * as d3Hexbin from "d3-hexbin";
import { grey } from '@mui/material/colors';

import { svgHeight, svgWidth, gTransform, hexRadius } from "data/hexagon-grid";
import { ROWS, COLS } from "data/grid-settings";
import { useAddDragHandler } from "apps/MainApp/hooks/useAddDragHandler";
import { IGridItem } from 'interfaces/IGridItem';

const hexbin = d3Hexbin.hexbin().radius(hexRadius);

interface Props {
    handleSvgMouseDown: () => void;
    handleSvgMouseUp: () => void;
    handleMouseDown: (e: React.MouseEvent<SVGElement>) => void;
    handleMouseOver: (e: React.MouseEvent<SVGElement>) => void;
    handleSvgMouseLeave: () => void;
    data: IGridItem[];
    setData: (data: IGridItem[]) => void;
}

export default function HexagonGrid(props: Props) {
    const { handleSvgMouseDown, handleSvgMouseUp, handleMouseDown, handleMouseOver, handleSvgMouseLeave, data, setData } = props;


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
    }, [])

    const computeClosestNode = (event: { x: number; y: number }) => {
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

    const handleMouseClick = () => {
        // For debugging if identify neighbors correctly
        // drawNeighbors(event);
    }


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

                    <path
                        id={dragGridItem.id}
                        key={dragGridItem.id}
                        stroke={grey[500]}
                        strokeWidth={1}
                        fill={dragGridItem.fill}
                        d={`M${dragGridItem.x},${dragGridItem.y}${hexbin.hexagon()}`} />
                </g>
            </svg>
        </div>
    )
}
