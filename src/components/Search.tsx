import {Autocomplete, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import SearchParamsStore from "../store/SearchParamsStore.tsx";
import MatrixStore from "../store/MatrixStore.tsx";


const Search = () => {
    const [selectedMatrix, setSelectedMatrix] = useState<string>('')
    const [isMatrixSelected, setIsMatrixSelected] = useState(false)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedLocations, setSelectedLocations] = useState<string[]>([])
    const [ids, setIds] = useState<string[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [locations, setLocations] = useState<string[]>([])

    const [names, setNames] = useState<string[]>([])
    // const [isBases, setIsBases] = useState<boolean[]>([])

    const searchParams = new SearchParamsStore()
    const matrixParams = new MatrixStore()

    const fetchParams = async () => {
        const params = await searchParams.getSearchParams(selectedMatrix)
        setIds(params[0])
        setCategories(params[1])
        setLocations(params[2])
        console.log('fetchParams')
    }

    const fetchQuantityMatrices = async () => {
        const quantity = await matrixParams.getQuantityMatrices()
        setNames(quantity[0])
        // setIsBases([quantity[1]])
    }

    useEffect(() => {
        fetchQuantityMatrices()
    }, [])

    useEffect(() => {
        if (isMatrixSelected) fetchParams()
    }, [selectedMatrix])

    const selectMatrix = (value :string) => {

        if (value.length > 0) {
            setIsMatrixSelected(true)
            setSelectedMatrix(value)
        }
        else setIsMatrixSelected(false)
    }

    return (
        <div className="min-w-52 mr-5">
            <Autocomplete
                noOptionsText={'Такой категории нет'}
                className="mr-5"
                options={names}
                sx={{width: "100%", marginBottom: '15px'}}
                ListboxProps={{style: {maxHeight: 300}}}
                onInputChange={(_event: React.SyntheticEvent, value: string) =>
                    selectMatrix(value)
                }
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="Матрица"
                    />
                }
            />
            <Autocomplete
                multiple
                disabled={!isMatrixSelected}
                noOptionsText={'Такой категории нет'}
                className="mr-5"
                options={ids}
                sx={{width: "100%", marginBottom: '15px'}}
                ListboxProps={{style: {maxHeight: 300}}}
                onChange={(_event, values)=> {
                    setSelectedIds(values)
                }}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="ID строки"
                    />
                }
            />
            <Autocomplete
                multiple
                disabled={!isMatrixSelected}
                noOptionsText={'Такой категории нет'}
                className="mr-5"
                options={categories}
                sx={{width: "100%", marginBottom: '15px'}}
                ListboxProps={{style: {maxHeight: 300}}}
                onChange={(_event, values)=> {
                    setSelectedCategories(values)
                }}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="Категория"
                    />
                }
            />
            <Autocomplete
                multiple
                disabled={!isMatrixSelected}
                noOptionsText={'Такой категории нет'}
                className="mr-5"
                options={locations}
                sx={{width: "100%", marginBottom: '15px'}}
                ListboxProps={{style: {maxHeight: 300}}}
                onChange={(_event, values)=> {
                    setSelectedLocations(values)
                }}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="Локация"
                    />
                }
            />
            <Button variant="contained"
                    disabled={!isMatrixSelected}
                    style={{
                        width: '100%',
                        backgroundColor: "#00AAFF",
                        color: "#000000"
                    }}
                    onClick={() => {
                        matrixParams.getRowsByParams([selectedIds, selectedCategories, selectedLocations])
                        console.log(selectedIds, selectedCategories, selectedLocations)
                    }}
            >Найти</Button>
        </div>
    );
};

export default Search;