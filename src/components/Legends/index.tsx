import React from 'react'
import styled from "styled-components";
import { colorsList } from "theme/grid-item-colors";

const ColorBox = styled.span`
    background: ${props => props.color || "#fff"};
    width: 12px;
    height: 12px;
    display: inline-block;
    margin-right: 4px;
`;

const Container = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    justify-content: center;
`;

const LegendBox = styled.div`
    display: flex;
    align-items: center;
    margin-right: 12px;
`;

export default function Legends() {
    return <Container>
        {colorsList.map((c) => {
            return <LegendBox key={c.text}>
                <ColorBox color={c.color} />
                <span>{c.text}</span>
            </LegendBox>
        })}
    </Container>

}
