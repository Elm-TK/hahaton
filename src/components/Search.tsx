import {Autocomplete, TextField} from "@mui/material";
import API_Service from "../API/API_Service.ts";
import {useEffect} from "react";
import Button from "@mui/material/Button";

const Search = () => {
    // const autocompleteOptions = API_Service.getForSearch()
    let categories :string[] = []
    let ids :number[] = []
    let locations :string[] = []
    async function fetch() {
        const res =  await API_Service.getForSearch()
        let cat :string[] = []
        let i :number[] = []
        let l :string[] = []
        res.forEach((row) => {
            ids.push(row.id)
            categories.push(row.category)
            locations.push(row.location)
        })
        categories = cat
        ids = i
        locations = l
    }
    useEffect(() => {
        fetch()
    },[])

    return (
        <div className="flex">
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
            <Autocomplete
                noOptionsText={'Такой категории нет'}
                className="mr-5"
                options={categories}
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
            <Autocomplete
                noOptionsText={'Такой категории нет'}
                className="mr-5"
                options={locations}
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
            <Button variant="contained"
                    style={{
                        backgroundColor: "#00AAFF",
                        color: "#000000",
                        // padding: "18px 36px"
                    }}
            >Найти</Button>
        </div>
    );
};

export default Search;