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
                <Slider
                    value={props.difficulty}
                    onChange={handleChange}
                    valueLabelDisplay="on"
                    disableSwap
                    step={10}
                    min={0}
                    max={2500}
                />
                
            </Box>
        </div>
    );
}