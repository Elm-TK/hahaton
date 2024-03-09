import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';



export default function InputBox() {


    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={locatin}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Локация" />}
        />
    );
}