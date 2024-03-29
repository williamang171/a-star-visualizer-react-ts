import { useState, useMemo, useEffect } from "react";
import * as d3 from "d3";

import { SQUARE_SIZE } from "data/square-grid";
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
    computeClosestNode: (event: any) => IGridItem | null;
}

export function useAddDragHandler({ data, setData, computeClosestNode }: Props) {
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
            // console.log(`Event x: ${event.x}, Event: y: ${event.y}`);
            const closestNode = computeClosestNode(event);
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
        handleDrag(d3.select(`.grid-item[data-row='${startGridItem.y}'][data-col='${startGridItem.x}']`));
        handleDrag(d3.select(`.grid-item[data-row='${endGridItem.y}'][data-col='${endGridItem.x}']`));
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