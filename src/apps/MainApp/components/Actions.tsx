import React, { useState } from 'react'
import { Button, Select, FormControl, InputLabel, MenuItem, Stack } from "@mui/material";

interface Props {
    findPath: () => void,
    reset: () => void,
    speed: string,
    setSpeed: (speed: string) => void
}


export default function Actions(props: Props) {
    const { findPath, reset, speed, setSpeed } = props;
    const handleChange = (e: any) => {
        setSpeed(e.target.value);
    }

    return (
        <Stack direction="row" spacing={1} sx={{ mb: 2 }} >

            <Button variant="contained" onClick={findPath} type="button">
                Find Path
            </Button>

            <Button variant="outlined" onClick={reset} type="button">
                Reset
            </Button>

            <FormControl sx={{ width: "300px" }} >
                <InputLabel>Speed</InputLabel>
                <Select size="small"
                    value={speed}
                    label="Speed"
                    onChange={handleChange}
                >
                    <MenuItem value={"immediate"}>Immediate</MenuItem>
                    <MenuItem value={"fast"}>Fast</MenuItem>
                    <MenuItem value={"normal"}>Normal</MenuItem>
                    <MenuItem value={"slow"}>Slow</MenuItem>
                </Select>
            </FormControl>

        </Stack>
    )

}
