import React from "react";
import { Button, Select, FormControl, InputLabel, MenuItem, Stack, Checkbox, FormGroup, FormControlLabel, SelectChangeEvent } from "@mui/material";
import GRID_TYPE from "constants/grid-type";
import { SPEED } from "constants/speed";
import { initialData } from "data/hexagon-grid";

interface Props {
    findPath: () => void,
    reset: () => void,
    speed: SPEED,
    setSpeed: (speed: any) => void,
    showCost: boolean,
    setShowCost: (cost: boolean) => void,
    gridType: GRID_TYPE,
    setGridType: (grid_type: any) => void,
    setData: (data: any) => void,
}

export default function Actions(props: Props) {
    const { findPath, reset, speed, setSpeed, showCost, setShowCost, gridType, setGridType, setData } = props;

    const handleChangeSpeed = (e: SelectChangeEvent<SPEED>) => {
        setSpeed(e.target.value);
    }

    const handleChangeShowCost = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setShowCost(checked);
    }

    const handleChangeGridType = (e: SelectChangeEvent<GRID_TYPE>) => {
        setGridType(e.target.value)
        setData(initialData);
    }

    return (
        <Stack direction="row" spacing={1} sx={{ mb: 2 }} >
            <Button variant="contained" onClick={findPath} type="button">
                Find Path
            </Button>

            <Button variant="outlined" onClick={reset} type="button">
                Reset
            </Button>

            <FormControl sx={{ width: "200px" }} >
                <InputLabel>Speed</InputLabel>
                <Select size="small"
                    value={speed}
                    label="Speed"
                    onChange={handleChangeSpeed}
                >
                    <MenuItem value={SPEED.IMMEDIATE}>Immediate</MenuItem>
                    <MenuItem value={SPEED.FAST}>Fast</MenuItem>
                    <MenuItem value={SPEED.NORMAL}>Normal</MenuItem>
                    <MenuItem value={SPEED.SLOW}>Slow</MenuItem>
                </Select>
            </FormControl>

            <FormControl sx={{ width: "200px" }} >
                <InputLabel>Grid Type</InputLabel>
                <Select size="small"
                    value={gridType}
                    label="Grid Type"
                    onChange={handleChangeGridType}
                >
                    <MenuItem value={GRID_TYPE.HEXAGON}>Hexagon</MenuItem>
                    <MenuItem value={GRID_TYPE.SQUARE}>Square</MenuItem>
                </Select>
            </FormControl>

            <FormGroup>
                <FormControlLabel control={<Checkbox checked={showCost} onChange={handleChangeShowCost} />} label="Show Cost" />
            </FormGroup>

        </Stack>
    )

}
