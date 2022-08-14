import React from "react";
import { Button, Select, FormControl, InputLabel, MenuItem, Stack, Checkbox, FormGroup, FormControlLabel, SelectChangeEvent } from "@mui/material";
import GRID_TYPE from "constants/grid-type";
import { SPEED } from "constants/speed";

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
    allowDiagonal: boolean,
    setAllowDiagonal: (s: boolean) => void;
    disabled: boolean,
}

export default function Actions(props: Props) {
    const { findPath, reset, speed, setSpeed, showCost, setShowCost, gridType, setGridType, setData, allowDiagonal, setAllowDiagonal, disabled } = props;

    const handleChangeSpeed = (e: SelectChangeEvent<SPEED>) => {
        setSpeed(e.target.value);
    }

    const handleChangeShowCost = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setShowCost(checked);
    }

    const handleChangeAllowDiagonal = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setAllowDiagonal(checked);
    }

    const handleChangeGridType = (e: SelectChangeEvent<GRID_TYPE>) => {
        setGridType(e.target.value)
        reset()
    }

    return (
        <Stack direction="row" spacing={1} sx={{ mb: 2 }} justifyContent="center" >
            <Button variant="contained" onClick={findPath} type="button" disabled={disabled}>
                Find Path
            </Button>

            <Button variant="outlined" onClick={reset} type="button" disabled={disabled}>
                Reset
            </Button>

            <FormControl sx={{ width: "200px" }} >
                <InputLabel>Speed</InputLabel>
                <Select size="small"
                    value={speed}
                    label="Speed"
                    onChange={handleChangeSpeed} disabled={disabled}
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
                    onChange={handleChangeGridType} disabled={disabled}
                >
                    <MenuItem value={GRID_TYPE.HEXAGON}>Hexagon</MenuItem>
                    <MenuItem value={GRID_TYPE.SQUARE}>Square</MenuItem>
                </Select>
            </FormControl>

            {/* <FormGroup>
                <FormControlLabel control={<Checkbox checked={showCost} onChange={handleChangeShowCost} disabled={disabled} />} label="Show Cost" />
            </FormGroup> */}

            <FormGroup>
                <FormControlLabel control={<Checkbox checked={gridType === GRID_TYPE.HEXAGON ? false : allowDiagonal} onChange={handleChangeAllowDiagonal} disabled={disabled || gridType === GRID_TYPE.HEXAGON} />} label="Allow Diagonal" />
            </FormGroup>

        </Stack>
    )

}
