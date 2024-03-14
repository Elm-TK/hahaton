import {Autocomplete, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import MatrixStore, {Baseline, Discount, SearchParams} from "../store/MatrixStore.tsx";
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
    const [loces, setLoces] = useState<string[]>([])
    const [cates, setCates] = useState<string[]>([])
    const [tableActive, setTableActive] = useState<boolean>(false)

    const matrixParams = new MatrixStore()


    const sendSearchParams = async () => {
        const lcs: string[] = []
        const cats: string[] = []
        const response = await matrixParams.getRowsByParams([selectedMatrix, selectedCategories, selectedLocations])
        response.map((obj) => {
            lcs.push(obj.location)
            cats.push(obj.category)
        })
        setReqRows(response)
        setLoces(lcs)
        setCates(cats)
        setTableActive(true)
    }

    const fetchQuantityMatrices = async () => {
        const quantity = await matrixParams.getQuantityMatrices()
        const matrices: string[] = []
        let cats: string[] = []
        let loces: string[] = []
        quantity[0].map((bases: Baseline) => {
            matrices.push(bases.name)
        })
        quantity[1].map((bases: Discount) => {
            matrices.push(bases.name)
        })
        cats = quantity[3]
        loces = quantity[4]
        setNames(matrices)
        setCategories(cats)
        setLocations(loces)
    }

    useEffect(() => {
        fetchQuantityMatrices()
    }, [])

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
                    options={names.sort()}
                    sx={{width: "100%", marginBottom: '15px'}}
                    ListboxProps={{style: {maxHeight: 300}}}
                    onInputChange={(_event: React.SyntheticEvent, value: string) => {
                        selectMatrix(value)
                        setTableActive(false)
                    }
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
                    options={categories.sort()}
                    sx={{width: "100%", marginBottom: '15px'}}
                    ListboxProps={{style: {maxHeight: 300}}}
                    onChange={(_event, values) => {
                        setSelectedCategories(values)
                        setTableActive(false)
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
                    options={locations.sort()}
                    sx={{width: "100%", marginBottom: '15px'}}
                    ListboxProps={{style: {maxHeight: 300}}}
                    onChange={(_event, values) => {
                        setSelectedLocations(values)
                        setTableActive(false)
                    }}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            label="Локация"
                        />
                    }
                />
                <Button variant="contained"
                        sx={{width: '100%'}}
                        disabled={!isMatrixSelected}
                        onClick={() => sendSearchParams()}
                >Найти</Button>
            </div>
            <div className="flex w-full items-center justify-center text-2xl">{tableActive ?
                <Table matrixName={selectedMatrix} categories={(!cates.length ? categories : cates)}
                       locations={(!loces.length ? locations : loces)}
                       rows={reqRows}/> :
                <p>Не выбрана матрица или в ней нет подходящих значений</p>}
            </div>
        </div>
    );
};
export default Search;