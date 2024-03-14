import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';

import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons, ruRU,
} from '@mui/x-data-grid';

import {ChangeEvent, useEffect, useState} from "react";
import MatrixStore, {SearchParams} from "../store/MatrixStore.tsx";
import {FormControlLabel, MenuItem, Radio, RadioGroup, TextField} from "@mui/material";


interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}

export type TableProps = {
    matrixName: string,
    locations: string[],
    categories: string[],
    rows: SearchParams[]
}


export default function Table(props: TableProps) {
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [rows, setRows] = useState<SearchParams[]>(props.rows)
    const [newRows, setNewRows] = useState<Map<number, string[]>>(new Map<number, string[]>)
    const [deletedRows, setDeletedRows] = useState<number[]>([])
    const [updatedRows, setUpdatedRows] = useState<Map<number, string[]>>(new Map<number, string[]>)
    const [maxId, setMaxId] = useState<number>(0)
    const [selectedRows, setSelectedRows] = useState<number[]>([])


    useEffect(() => {
        if (rows != props.rows) {
            setRows(props.rows)
        }

        if (maxId != props.rows.length) {
            setMaxId(Number(props.rows[rows.length - 1].id))
        }
    }, [])

    const matrixStore = new MatrixStore()

    const putChangesMatrix = async () => {
        const response = await matrixStore.createChangesMatrix(props.matrixName, updatedRows, newRows, deletedRows)
        window.location.reload();
        return response
    }

    function EditToolbar(props: EditToolbarProps) {
        const {setRows, setRowModesModel} = props;

        const handleClick = () => {
            const id = maxId + 1
            setNewRows(newRows.set(id, []))
            setMaxId(maxId + 1)
            setRows((oldRows) => [...oldRows, {id, name: '', email: '', isNew: true}]);
            setRowModesModel((oldModel) => ({
                ...oldModel,
                [id]: {mode: GridRowModes.Edit, fieldToFocus: 'name'},
            }))
        }

        return (
            <GridToolbarContainer>
                <Button color="primary" startIcon={<AddIcon/>} onClick={handleClick}>
                    Добавить строку
                </Button>
            </GridToolbarContainer>
        );
    }


    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.Edit}});
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View}});
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        if (newRows.get(Number(id))) {
            const nr = newRows
            nr.delete(Number(id))
            setNewRows(nr)
        } else setDeletedRows([...deletedRows, Number(id)])
        if (updatedRows.get(Number(id))) {
            const ur = updatedRows
            ur.delete(Number(id))
            setUpdatedRows(ur)
        }
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: {mode: GridRowModes.View, ignoreModifications: true},
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        if ((newRow.category && newRow.location && newRow.value)) {
            if (newRows.get(newRow.id))
                setNewRows(newRows.set(newRow.id, [newRow.category, newRow.location, newRow.value]))
            else
                setUpdatedRows(updatedRows.set(Number(newRow.id), [newRow.category, newRow.location, newRow.value]))
            const updatedRow = {...newRow, isNew: false};
            setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
            return updatedRow;
        }
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            type: 'number',
            width: 100,
            editable: false,
            headerAlign: "left",
            align: "left",
        },
        {
            field: 'category',
            headerName: 'Категория',
            width: 225,
            editable: true,
            type: 'singleSelect',
            valueOptions: [...new Set(props.categories)],
        },
        {
            field: 'location',
            headerName: 'Локация',
            width: 225,
            editable: true,
            type: 'singleSelect',
            valueOptions: [...new Set(props.locations)],
        },
        {
            field: 'value',
            headerName: 'Цена',
            width: 100,
            type: 'number',
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Действия',
            width: 130,
            cellClassName: 'actions',
            getActions: ({id}) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon/>}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon/>}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon/>}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon/>}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];
    const [radioValue, setRadioValue] = useState("up")
    const [valueChange, setValueChange] = useState(0)
    const [percentOrValue, setPercentOrValue] = useState("percent")
    // const []
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRadioValue((event.target as HTMLInputElement).value);
    };
    const currencies = [
        {
            value: 'percent',
            label: '%',
        },
        {
            value: 'value',
            label: '₽',
        }
    ]

    const changeSelectedRows = async () => {
        const response = matrixStore.changePrice(props.matrixName, selectedRows, radioValue, valueChange, percentOrValue)
        window.location.reload();
        return response
    }
    return (
        <div className="flex flex-col">
            <div className="flex">
                <Box
                    sx={{
                        height: '600px',
                        width: '850px',
                        '& .actions': {
                            color: 'text.secondary',
                        },
                        '& .textPrimary': {
                            color: 'text.primary',
                        },
                    }}
                >
                    <DataGrid
                        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                        checkboxSelection
                        rows={rows}
                        columns={columns}
                        editMode="row"
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        slots={{
                            toolbar: EditToolbar,
                        }}
                        slotProps={{
                            toolbar: {setRows, setRowModesModel},
                        }}
                        onRowSelectionModelChange={(ids) => {
                            setSelectedRows(ids.map(string => +string))
                        }}
                    />
                </Box>
                <Button variant="contained" sx={{marginLeft: "5px"}}
                        onClick={() => putChangesMatrix()}>Отправить</Button>
            </div>
            <div className="flex items-center justify-center mt-5">
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    defaultValue="up"
                    onChange={handleChange}
                >
                    <FormControlLabel value="up" control={<Radio/>} label='Увеличить'/>
                    <FormControlLabel value="down" control={<Radio/>} label='Уменьшить'/>
                </RadioGroup>
                <p className="mr-5 text-lg">выделенные на</p>
                <TextField
                    id="outlined-controlled"
                    type="number"
                    value={valueChange}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setValueChange(Number(event.target.value));
                    }}
                />
                <TextField
                    id="percent-or-value"
                    select
                    defaultValue={'percent'}
                    onChange={(event) => setPercentOrValue(event.target.value)}
                >
                    {currencies.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <Button sx={{marginLeft: '10px'}} variant="contained"
                        onClick={() => changeSelectedRows()}>Изменить</Button>
            </div>
        </div>
    );
}
