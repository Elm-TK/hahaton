import {Autocomplete, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import SearchParamsStore from "../store/SearchParamsStore.tsx";
import MatrixStore from "../store/MatrixStore.tsx";


const Search = () => {
    // const autocompleteOptions = API_Service.getForSearch()

    const [ids, setIds] = useState<number[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [locations, setLocations] = useState<string[]>([])

    const [names, setNames] = useState<string[]>([])
    const [isBases, setIsBases] = useState<boolean[]>([])

    const searchParams = new SearchParamsStore()
    const matrixParams = new MatrixStore()

    const fetchParams = async () => {
        const params = await searchParams.getSearchParams()
        setIds(params[0])
        setCategories(params[1])
        setLocations(params[2])
    }

    const fetchQuantityMatrices = async () =>{
        const quantity = await matrixParams.getQuantityMatrices()
        setNames(quantity[0])
        setIsBases([quantity[1]])
    }

    useEffect(() => {
        fetchParams()
        fetchQuantityMatrices()
    }, [])

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