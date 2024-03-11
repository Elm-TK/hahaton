import {Autocomplete, TextField} from "@mui/material";
import API_Service from "../API/API_Service.ts";

const Search = () => {
    const autocompleteOptions = API_Service.getForSearch()
    const categories :string[] = []
    const ids :number[] = []
    const locations :string[] = []
    let out; autocompleteOptions.then(x => out = x); console.log(out)
    // autocompleteOptions.forEach((row) => {
    //     ids.push(row.id)
    //     categories.push(row.category)
    //     locations.push(row.location)
    // })
    return (
        <div>
            <Autocomplete
                noOptionsText={'Такой категории нет'}
                className="mr-5"
                options={ids}
                sx={{width: "100%"}}
                // ref={autoCompleteRef}
                ListboxProps={{style: {maxHeight: 300}}}
                onKeyDown={(event) => {
                    event.defaultMuiPrevented = true;
                    if (event.key === 'Enter') {
                        // checkAnswer()
                    }
                }}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        // inputRef={valueRef}
                        // error={isError}
                        // helperText={isError ? helperText : ""}
                        label="Country"
                    />
                }
            />
        </div>
    );
};

export default Search;