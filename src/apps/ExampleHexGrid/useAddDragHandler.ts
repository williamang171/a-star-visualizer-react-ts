import { useState, useMemo, useEffect } from "react";
import * as d3 from "d3";

import { SQUARE_SIZE } from "apps/MainApp/data";
import gridItemColors from "theme/grid-item-colors";
import { IGridItem } from "interfaces/IGridItem";


const initialDragGridItem = {
    id: "for-dnd",
    key: "for-dnd",
    opacity: 1,
    fill: gridItemColors.BLANK,
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    x: 99999,
    y: 99999
}

interface Props {
    data: IGridItem[];
    setData: (data: any) => void;
    points: [number, number][]
}

export function useAddDragHandler({ data, setData, points }: Props) {
    const [dragGridItem, setDragGridItem] = useState(initialDragGridItem)

    const addHandleDrag = (startGridItem: IGridItem, endGridItem: IGridItem) => {
        const handleDrag = d3.drag().on('drag', function (event) {
            setDragGridItem({
                ...dragGridItem,
                opacity: 1,
                x: event.x,
                y: event.y,
                fill: d3.select(this).attr("fill")
            })
        }).on('end', function (event) {
            let closestNode: IGridItem | null = null;
            let currentClosestRange = Infinity;
            console.log(`Event x: ${event.x}`);
            console.log(`Event y: ${event.y}`);

            points.forEach((d, i) => {
                // console.log(`d x: ${d.x}`);
                // console.log(`d y: ${d.y}`);
                const diff = (Math.abs((event.x) - d[0]) + Math.abs((event.y) - d[1]));
                if (diff < currentClosestRange) {
                    closestNode = data[i];
                    currentClosestRange = diff;
                }
            })
            const newData = data.map((d) => {
                const selectedColor = d3.select(this).attr("fill");
                const isClosestNode = closestNode && d.x === closestNode.x && closestNode.y === d.y;
                if (isClosestNode) {
                    return {
                        ...d,
                        color: selectedColor
                    }
                }
                if (d.color === selectedColor && !isClosestNode) {
                    return {
                        ...d,
                        color: gridItemColors.BLANK
                    }
                }
                return d;
            })
            setData(newData)
            setDragGridItem({
                ...dragGridItem,
                opacity: 0,
                x: 99999,
                y: 99999,
                fill: gridItemColors.BLANK
            })
            d3.select(this).on('mousedown.drag', null);
        });
        handleDrag(d3.select(`.hexagon[data-row='${startGridItem.x}'][data-col='${startGridItem.y}']`));
        handleDrag(d3.select(`.hexagon[data-row='${endGridItem.x}'][data-col='${endGridItem.y}']`));
    }

    const latestStartNode = useMemo(() => {
        return data.find((d) => {
            return d.color === gridItemColors.START
        })
    }, [data])

    const latestEndNode = useMemo(() => {
        return data.find((d) => {
            return d.color === gridItemColors.END;
        })
    }, [data])

    useEffect(() => {
        if (latestStartNode && latestEndNode) {
            addHandleDrag(latestStartNode, latestEndNode);
        }
    }, [data, latestStartNode, latestEndNode])

    return {
        dragGridItem
    }
}