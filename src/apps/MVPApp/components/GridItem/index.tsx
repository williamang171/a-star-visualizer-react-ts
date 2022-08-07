import colors from "theme/grid-item-colors";
import React, { useState } from 'react'
import styled from "styled-components";

const Wrapper = styled.span`
    display: inline-block;
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
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

const GridItemContentContainer = styled.div`
    position: absolute;
`;

const CostContainer = styled.div`
    font-size: 1.5em;
`;

const LetterContainer = styled.div`
    display: flex;
    justify-content: center;
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    font-size: 3em;
`;

interface GridItemContentProps {
    fCost: number;
    gCost: number;
    hCost: number;
    hideCost: boolean;
    color: string;
}

const GridItemContent = (props: GridItemContentProps) => {
    if (props.color === colors.START) {
        return <LetterContainer>
            <div>
                A
            </div>
        </LetterContainer>

    }

    if (props.color === colors.END) {
        return <LetterContainer>
            B
        </LetterContainer>
    }

    return <GridItemContentContainer>
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
    </GridItemContentContainer>
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
            <GridItemContent
                hideCost={props.color === colors.START || props.color === colors.END}
                color={props.color}
                gCost={props.gCost}
                fCost={props.fCost}
                hCost={props.hCost}
            />

            <Coords>
                {`X${x}, Y${y}`}
            </Coords>
        </Wrapper>
    )
}
