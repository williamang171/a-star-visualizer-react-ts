import React, { useMemo, useState, useEffect } from 'react'
import * as d3Hexbin from "d3-hexbin";
import { pink } from '@mui/material/colors';

import { svgHeight, svgWidth, gTransform, hexRadius, initialData, ROWS, COLS } from "./data";
import gridItemColors from 'theme/grid-item-colors';
import { useAddDragHandler } from "./useAddDragHandler";
import { IGridItem } from 'interfaces/IGridItem';
import identifyNeighbours from './identify-neighbours';
import { updateGridWithNeighbors } from './update-grid-with-neighbors';
import { algorithm } from './algorithms';
import _ from 'lodash';
import { SPEED } from 'configs/speed';

const hexbin = d3Hexbin.hexbin().radius(hexRadius);

const speed = SPEED.FAST;

export default function ExampleHexGrid() {
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [data, setData] = useState(initialData);
    const [triggerRunPath, setTriggerRunPath] = useState(false);

    const redraw = (grid: Array<Array<IGridItem>>) => {
        const flatGrid = _.flattenDeep(grid);
        setData(flatGrid)
    }

    const findPath = () => {
        // Transform grid[] to grid[][] 
        const grid: Array<Array<IGridItem>> = [];
        data.forEach((d) => {
            if (grid.length <= d.y) {
                grid.push([]);
            }
            grid[d.y].push(d)
        })
        const gridWithNeighbors = updateGridWithNeighbors(grid, ROWS, COLS);
        console.log(gridWithNeighbors);
        const startNode = data.find((d) => d.color === gridItemColors.START);
        const endNode = data.find((d) => d.color === gridItemColors.END);
        if (startNode && endNode) {
            const startGridItem = gridWithNeighbors[startNode.y][startNode.x];
            const endGridItem = gridWithNeighbors[endNode.y][endNode.x];
            const pathFound = algorithm(redraw, gridWithNeighbors, startGridItem, endGridItem, speed)
        }
        else {
            console.log("startNode and endNode not available!");
        }
    }

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

    const handleMousedown = (e: any) => {
        updateGridItem(e);
    }

    const handleMouseOver = (e: any,) => {
        if (!isMouseDown) {
            return;
        }
        updateGridItem(e);
    }

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

    const { dragGridItem } = useAddDragHandler({ data, setData, points: generatedPoints })

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
        const flatGrid = _.flattenDeep(newGrid);
        // console.log(flatGrid);
        setData(flatGrid)
    }

    const handleMouseClick = (event: React.MouseEvent<SVGPathElement>) => {
        // For debugging if identify neighbors correctly
        // drawNeighbors(event);
    }

    useEffect(() => {
        if (triggerRunPath === true) {
            setTriggerRunPath(false);
            findPath()
        }
    }, [triggerRunPath, data])

    const reset = () => {
        setData(initialData);
    }

    const findPathTrigger = () => {
        const toClear = [gridItemColors.OPEN, gridItemColors.CLOSED, gridItemColors.PATH];
        const newData = data.map((d) => {
            const newD = {
                ...d,
                fCost: Infinity,
                gCost: Infinity,
                hCost: Infinity,
            }
            if (toClear.includes(d.color)) {
                return {
                    ...newD,
                    color: gridItemColors.BLANK
                }
            }
            return newD;
        })
        setData(newData);
        setTriggerRunPath(true);
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
                                className='hexagon'
                                stroke='grey'
                                strokeWidth={1}
                                fill={data[i].color}
                                d={`M${p.x},${p.y}${hexbin.hexagon()}`}
                                data-row={data[i].y}
                                data-col={data[i].x}
                                onMouseDown={handleMousedown}
                                onMouseOver={handleMouseOver} />
                        })}
                    </g>
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
            <button onClick={findPathTrigger}>Find Path</button>
        </div>
    )
}
