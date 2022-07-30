import React, { useState } from 'react'
import styled from "styled-components";

const Wrapper = styled.span`
    display: inline-block;
    width: 100px;
    height: 100px;
    border: 1px solid black;
    background: ${(props) => props.color ? props.color : "white"};
`;

interface Props {
    x: number;
    y: number;
    color: string;
    onClick: (x: number, y: number) => void,
    fCost: number;
}

export default function Node(props: Props) {
    const { x, y } = props;

    const handleClick = () => {
        props.onClick(x, y);
    }

    return (
        <Wrapper color={props.color} onClick={handleClick}>
            <div>
                {`X${x}, Y${y}`}
            </div>
            <div>
                {`FCost: ${props.fCost}`}
            </div>
        </Wrapper>
    )
}
