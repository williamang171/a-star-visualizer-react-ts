import React, { useMemo } from 'react'
import { IGridItem } from 'interfaces/IGridItem';
import Node from "../GridItem";
import styled from 'styled-components';

interface Props {
    grid: Array<Array<IGridItem>>,
    gridItemOnClick: (x: number, y: number) => void
}

const Row = styled.div`
    height: 100px;
`;

export default function Grid(props: Props) {
    const { grid = [] } = props;

    const rowsEls = useMemo(() => {
        let rows = [];
        for (let i = 0; i < grid.length; i++) {
            let nodes = [];
            for (let j = 0; j < grid[i].length; j++) {
                const gridItem = grid[i][j];
                const { color, fCost, gCost, hCost, id, x, y } = gridItem;
                nodes.push(<Node x={x} y={y} key={id} color={color} onClick={props.gridItemOnClick} fCost={fCost} gCost={gCost} hCost={hCost} />);
            }
            const row = <Row key={`row-${i}`}>
                {nodes}
            </Row>
            rows.push(row);
        }
        return rows;
    }, [grid])

    return <div>
        {rowsEls}
    </div>
}
