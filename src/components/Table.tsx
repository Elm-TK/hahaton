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

import {useState} from "react";
import MatrixStore, {SearchParams} from "../store/MatrixStore.tsx";


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
    const [maxId, setMaxId] = useState<number>(props.rows.length)
    const [selectedRows, setSelectedRows] = useState<number[]>([])


    if (rows != props.rows) {
        setRows(props.rows)
    }

    if (maxId != props.rows.length) {
        setMaxId(props.rows.length)
    }

    const matrixStore = new MatrixStore()

    const putChangesMatix = async () => {
        await matrixStore.createChangesMatrix(props.matrixName, updatedRows, newRows, deletedRows)
    }

    function EditToolbar(props: EditToolbarProps) {
        const {setRows, setRowModesModel} = props;

        const handleClick = () => {
            const id = Number(maxId + 1);
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
        }
        newRows.delete(Number(id))
        if (updatedRows.get(Number(id))) {
            const ur = updatedRows
            ur.delete(Number(id))
            setUpdatedRows(ur)
            setDeletedRows([...deletedRows, Number(id)])
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
        if (newRow.category && newRow.location && newRow.value) {
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
            width: 250,
            editable: true,
            type: 'singleSelect',
            valueOptions: props.categories,
        },
        {
            field: 'location',
            headerName: 'Локация',
            width: 250,
            editable: true,
            type: 'singleSelect',
            valueOptions: props.locations,
        },
        {
            field: 'value',
            headerName: 'Цена',
            width: 120,
            type: 'number',
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Действия',
            width: 180,
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
    // console.log('newRows', newRows)
    // console.log('updatedRows', updatedRows)
    // console.log('deletedRows', deletedRows)
    return (
        <>
            <Box
                sx={{
                    height: '700px',
                    width: '100%',
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
            <Button variant="contained" onClick={() => putChangesMatix()}>Пуск</Button>
        </>
    );
}
