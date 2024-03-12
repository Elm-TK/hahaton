import {Autocomplete, TextField} from "@mui/material";
import {useState} from "react";
import MatrixStore from "../store/MatrixStore.tsx";

const Segments = () => {
    const [names, setNames] = useState<string[]>([])
    const [isBases, setIsBases] = useState<boolean[]>([])

    const matrixParams = new MatrixStore()

    const fetchQuantityMatrices = async () => {
        const quantity = await matrixParams.getQuantityMatrices()
        setNames(quantity[0])
        setIsBases([quantity[1]])
    }

    return (
        <div>
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
        </div>
    );
};

export default Segments;