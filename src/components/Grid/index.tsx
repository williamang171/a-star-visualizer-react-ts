import React, { useMemo } from 'react'
import Node from "../GridItem";

interface Props {
    grid: Array<Array<any>>,
    gridItemOnClick: (x: number, y: number) => void
}

export default function Grid(props: Props) {
    const { grid = [] } = props;

    const rowsEls = useMemo(() => {
        let rows = [];
        for (let i = 0; i < grid.length; i++) {
            let nodes = [];
            for (let j = 0; j < grid[i].length; j++) {
                nodes.push(<Node x={i} y={j} key={grid[i][j].id} color={grid[i][j].color} onClick={props.gridItemOnClick} fCost={grid[i][j].fCost} />);
            }
            const row = <div key={`row-${i}`}>
                {nodes}
            </div>
            rows.push(row);
        }
        return rows;
    }, [grid])

    return <div>
        {rowsEls}
    </div>
}
