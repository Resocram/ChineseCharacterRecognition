import { Box, Slider } from "@mui/material";

const MIN_DISTANCE = 1;

export default function DifficultySetter(props) {
    const handleChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
          return;
        }
    
        if (activeThumb === 0) {
            props.setDifficulty([Math.min(newValue[0], props.difficulty[1] - MIN_DISTANCE), props.difficulty[1]]);
        } else {
            props.setDifficulty([props.difficulty[0], Math.max(newValue[1], props.difficulty[0] + MIN_DISTANCE)]);
        }
    };

    return (
        <div>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <h4>Difficulty</h4>
                <Slider
                    value={props.difficulty}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    disableSwap
                    step={100}
                    min={0}
                    max={2000}
                />
            </Box>
        </div>
    );
}