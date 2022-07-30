import React, { useState } from 'react'
import styled from "styled-components";

const Wrapper = styled.span`
    display: inline-block;
    width: 100px;
    height: 100px;
    border: 1px solid black;
    background: ${(props) => props.color ? props.color : "white"};
    position: relative;
    box-sizing: border-box;
    
`;

const Coords = styled.div`
    display: flex;
    justify-content: flex-end;
    font-size: 0.8em;
    position: absolute;
    right: 0px;
    bottom: 0px;
`;

const FCostContainer = styled.div`
    display: flex;
    justify-content: center;
    font-size: 2em;
`;

const CostContainer = styled.div`
    font-size: 1.5em;
`;

interface CostsProps {
    fCost: number;
    gCost: number;
    hCost: number;
}

const CostsContainer = styled.div`
    position: absolute;
`;

const Costs = (props: CostsProps) => {
    return <CostsContainer>
        <div style={{ display: "flex", justifyContent: "space-around", width: "100px" }} >
            <CostContainer>
                {props.gCost === Infinity ? " " : props.gCost}
            </CostContainer>
            <CostContainer>
                {props.hCost === Infinity ? " " : props.hCost}
            </CostContainer>
        </div>
        <FCostContainer>
            {props.fCost === Infinity ? " " : props.fCost}
        </FCostContainer>
    </CostsContainer>
}

interface Props {
    x: number;
    y: number;
    color: string;
    onClick: (x: number, y: number) => void,
    fCost: number;
    gCost: number;
    hCost: number;
}

export default function Node(props: Props) {
    const { x, y } = props;

    const handleClick = () => {
        props.onClick(x, y);
    }

    return (
        <Wrapper color={props.color} onClick={handleClick}>
            <Costs gCost={props.gCost}
                fCost={props.fCost}
                hCost={props.hCost}
            />

            <Coords>
                {`X${x}, Y${y}`}
            </Coords>
        </Wrapper>
    )
}
