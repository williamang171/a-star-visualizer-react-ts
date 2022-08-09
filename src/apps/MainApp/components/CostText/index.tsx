import { SQUARE_SIZE } from "data";
import gridItemColors from "theme/grid-item-colors";
import { IGridItem } from "interfaces/IGridItem";

interface Props {
    d: IGridItem,
    showCost: boolean
}

export default function CostText({ d, showCost }: Props) {
    if (!showCost) {
        return null;
    }

    if (d.color !== gridItemColors.START && d.color !== gridItemColors.END) {
        return <>
            <text
                x={d.x * SQUARE_SIZE + 8}
                y={d.y * SQUARE_SIZE + 12}
                font-size="12"
                style={{
                    userSelect: "none",
                    pointerEvents: "none"
                }}
                focusable={false}
                fill="white">
                {d.fCost === Infinity ? "" : `${d.fCost}`}
            </text>
            <text
                x={d.x * SQUARE_SIZE + 16}
                y={d.y * SQUARE_SIZE + 24}
                font-size="10"
                style={{
                    userSelect: "none",
                    pointerEvents: "none"
                }}
                fill="white">
                {d.hCost === Infinity ? "" : `${d.hCost}`}
            </text>
            <text
                x={d.x * SQUARE_SIZE + 2}
                y={d.y * SQUARE_SIZE + 24}
                font-size="10"
                style={{
                    userSelect: "none",
                    pointerEvents: "none"
                }}
                fill="white">
                {d.gCost === Infinity ? "" : `${d.gCost}`}
            </text>
        </>
    }

    return null;
}
