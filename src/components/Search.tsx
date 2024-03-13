import {Autocomplete, CircularProgress, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import SearchParamsStore from "../store/SearchParamsStore.tsx";
import MatrixStore, {Baseline, SearchParams} from "../store/MatrixStore.tsx";
import Table from "./Table.tsx";


const Search = () => {
    const [selectedMatrix, setSelectedMatrix] = useState<string>('')
    const [isMatrixSelected, setIsMatrixSelected] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedLocations, setSelectedLocations] = useState<string[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [locations, setLocations] = useState<string[]>([])
    const [reqRows, setReqRows] = useState<SearchParams[]>([])
    const [names, setNames] = useState<string[]>([])

    const matrixParams = new MatrixStore()


    const sendSearchParams = async () => {
       const response = await  matrixParams.getRowsByParams([selectedMatrix, selectedCategories, selectedLocations])
        console.log(response)
        setReqRows(response)
    }

    const fetchQuantityMatrices = async () => {
        const quantity = await matrixParams.getQuantityMatrices()
        const baselinesNames: string[] = []
        let cats: string[] = []
        let loces: string[] = []
        quantity[0].map((bases: Baseline) => {
            baselinesNames.push(bases.name)
        })


        cats = quantity[3]
        loces = quantity[4]


        setNames(baselinesNames)
        setCategories(cats)
        setLocations(loces)
        // setIsBases([quantity[1]])
    }

    useEffect(() => {
        fetchQuantityMatrices()
    }, [])

    // useEffect(() => {
    //     if (isMatrixSelected) fetchParams()
    // }, [selectedMatrix])

    const selectMatrix = (value: string) => {

        if (value.length > 0) {
            setIsMatrixSelected(true)
            setSelectedMatrix(value)
        } else setIsMatrixSelected(false)
    }

    return (
        <div className="flex">
            <div className="min-w-52 mr-5">
                <Autocomplete
                    noOptionsText={'Такой матрицы нет'}
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
                {/*<Autocomplete*/}
                {/*    multiple*/}
                {/*    disabled={!isMatrixSelected}*/}
                {/*    noOptionsText={'Такого ID нет'}*/}
                {/*    className="mr-5"*/}
                {/*    options={ids}*/}
                {/*    sx={{width: "100%", marginBottom: '15px'}}*/}
                {/*    ListboxProps={{style: {maxHeight: 300}}}*/}
                {/*    onChange={(_event, values) => {*/}
                {/*        setSelectedIds(values)*/}
                {/*    }}*/}
                {/*    renderInput={(params) =>*/}
                {/*        <TextField*/}
                {/*            {...params}*/}
                {/*            label="ID строки"*/}
                {/*        />*/}
                {/*    }*/}
                {/*/>*/}
                <Autocomplete
                    multiple
                    disabled={!isMatrixSelected}
                    noOptionsText={'Такой категории нет'}
                    className="mr-5"
                    options={categories}
                    sx={{width: "100%", marginBottom: '15px'}}
                    ListboxProps={{style: {maxHeight: 300}}}
                    onChange={(_event, values) => {
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
                    noOptionsText={'Такой локации нет'}
                    className="mr-5"
                    options={locations}
                    sx={{width: "100%", marginBottom: '15px'}}
                    ListboxProps={{style: {maxHeight: 300}}}
                    onChange={(_event, values) => {
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
                        onClick={() => sendSearchParams()}
                >Найти</Button>
            </div>
            <>{(isMatrixSelected && reqRows.length > 0) ?
                <Table matrixName={selectedMatrix} categories={categories} locations={locations} rows={reqRows}/> :
                <CircularProgress/>}</>
        </div>
    );
};
// categories={categories} locations={locations} prices={prices}
export default Search;