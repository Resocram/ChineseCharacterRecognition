import Slider from "@mui/material/Slider";

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
            <Slider
                value={props.difficulty}
                onChange={handleChange}
                valueLabelDisplay="auto"
                disableSwap
                step={10}
                min={0}
                max={2500}
                sx={{
                    color: 'var(--accent-primary)',
                    '& .MuiSlider-thumb': {
                        backgroundColor: 'var(--accent-primary)',
                    },
                    '& .MuiSlider-track': {
                        backgroundColor: 'var(--accent-primary)',
                    },
                    '& .MuiSlider-rail': {
                        backgroundColor: 'var(--border-color)',
                    },
                }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span>Character range: {props.difficulty[0]} - {props.difficulty[1]}</span>
            </div>
        </div>
    );
}
