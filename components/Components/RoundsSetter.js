import Slider from "@mui/material/Slider";

export default function RoundsSetter(props) {
    const maxRounds = Math.max(1, props.maxRounds);
    const value = Math.min(props.numRounds, maxRounds);

    const handleChange = (event, newValue) => {
        props.setNumRounds(newValue);
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <Slider
                value={value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                disableSwap
                step={1}
                min={1}
                max={maxRounds}
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
                <span>Words to play: {value} / {maxRounds} available</span>
            </div>
        </div>
    );
}
