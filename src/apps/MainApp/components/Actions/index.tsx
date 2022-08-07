import { Button, Select, FormControl, InputLabel, MenuItem, Stack, Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import { SPEED } from "configs/speed";


interface Props {
    findPath: () => void,
    reset: () => void,
    speed: SPEED,
    setSpeed: (speed: SPEED) => void,
    showCost: boolean,
    setShowCost: (cost: boolean) => void
}

export default function Actions(props: Props) {
    const { findPath, reset, speed, setSpeed, showCost, setShowCost } = props;
    const handleChange = (e: any) => {
        setSpeed(e.target.value);
    }

    const handleChangeShowCost = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setShowCost(checked);
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
                    <MenuItem value={SPEED.IMMEDIATE}>Immediate</MenuItem>
                    <MenuItem value={SPEED.FAST}>Fast</MenuItem>
                    <MenuItem value={SPEED.NORMAL}>Normal</MenuItem>
                    <MenuItem value={SPEED.SLOW}>Slow</MenuItem>
                </Select>
            </FormControl>

            <FormGroup>
                <FormControlLabel control={<Checkbox checked={showCost} onChange={handleChangeShowCost} />} label="Show Cost" />
            </FormGroup>

        </Stack>
    )

}
