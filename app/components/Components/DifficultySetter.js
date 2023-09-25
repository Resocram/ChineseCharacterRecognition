import { Box, Button, TextField } from "@mui/material";

export default function DifficultySetter(props) {

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
                <TextField
                    id="outlined-number"
                    label="Difficulty"
                    type="number"
                    defaultValue="1000"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="outlined-number"
                    label="Lower Bound"
                    type="number"
                    defaultValue="1"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button type="reset" className="button" id="reset">Reset</Button>
            </Box>
            {/* <form>
                <label htmlFor="difficulty" className="test">Difficulty (How many characters to test, 1-1000):</label>
                <input type ="text" className="test" id="difficulty" name="difficulty"></input>
                <label htmlFor="lowerbound" className="test">Lower Bound (dev usage):</label>
                <input type ="text" className="test" id="lowerbound" name="lowerbound"></input>
                <button type="reset" className="button" id="reset">Reset</button>
            </form> */}
        </div>
    );
}