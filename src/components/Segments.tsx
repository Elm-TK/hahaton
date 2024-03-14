import {SyntheticEvent, useEffect, useState} from "react";
import MatrixStore, {Baseline, Discount} from "../store/MatrixStore.tsx";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridEventListener,
    GridRowEditStopReasons, GridRowId, GridRowModel,
    GridRowModes,
    GridRowModesModel,
    ruRU
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import {Autocomplete, TextField} from "@mui/material";

export type DiscountAndSegments = {
    id: number
    discountName: string
    segment?: number[]
}

export default function Segments() {
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [rows, setRows] = useState<DiscountAndSegments[]>({} as DiscountAndSegments[])
    const [updatedRows, setUpdatedRows] = useState<Map<number, number>>(new Map<number, number>)
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [bases, setBases] = useState<Baseline[]>([])
    const [discounts, setDiscounts] = useState<Discount[]>([])
    const [freeSegments, setFreeSegments] = useState<number[] | string[]>([])


    const [selectedMatrix, setSelectedMatrix] = useState<Baseline>({} as Baseline)

    const matrixParams = new MatrixStore()

    const fetchQuantityMatrices = async () => {
        const quantity = await matrixParams.getQuantityMatrices()
        const b = quantity[0] as Baseline[]
        const rs: DiscountAndSegments[] = []
        const selected: number[] = []
        for (let i = 0; i < quantity[1].length; i++) {
            const r: DiscountAndSegments = {} as DiscountAndSegments
            r.id = quantity[1][i].id
            r.discountName = quantity[1][i].name
            if (quantity[0][i])
                r.segment = quantity[1][i].segment
            rs.push(r)
            if (quantity[1][i].active) {
                selected.push(r.id)
            }
        }
        setSelectedRows(selected)
        setRows(rs)
        setSelectedMatrix(b.filter((m) => m.active)[0])
        setBases(b)
        setDiscounts(quantity[1] as Baseline[])
        setFreeSegments([...quantity[2], '—'])
    }


    const selectMatrix = (name: string) => {

        if (name.length > 0) {
            const matrix = bases.filter((m) => m.name == name)[0]
            setSelectedMatrix(matrix)
        }
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

    const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
        if (newRow.discountName && newRow.segment) {
            const newFreeSegments = [...freeSegments.filter((s) => s != newRow.segment || s == '—')]
            if (oldRow.segments) newFreeSegments.push(oldRow.segments)
            setFreeSegments(newFreeSegments)
            setUpdatedRows(updatedRows.set(newRow.id, newRow.segment))
            const updatedRow = {...newRow, isNew: false};
            setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
            return updatedRow;
        }
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const createStorage = async () => {
        const response = matrixParams.createStorage(selectedMatrix.id, selectedRows, updatedRows)
        window.location.reload();
        return response
    }

    useEffect(() => {
        fetchQuantityMatrices()
    }, [])
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 100,
            editable: false
        },
        {
            field: 'discountName',
            headerName: 'Discount матрица',
            width: 300,
            editable: false,
            type: 'singleSelect',
            valueOptions: discounts.map((d) => d.name),
        },
        {
            field: 'segment',
            headerName: 'Сегмент',
            width: 300,
            editable: true,
            type: 'singleSelect',
            valueOptions: freeSegments.sort(),
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
                ];
            },
        },
    ];

    return (
        <>
            {bases.length > 0 ?
                <div className="flex">
                    <Autocomplete
                        value={selectedMatrix.name}
                        noOptionsText={'Такой категории нет'}
                        className="mr-5"
                        options={bases.map((obj: Baseline) => obj.name)}
                        sx={{width: "100%", marginBottom: '15px'}}
                        ListboxProps={{style: {maxHeight: 300}}}
                        onInputChange={(_event: SyntheticEvent, value: string) =>
                            selectMatrix(value)
                        }
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="Активная матрица"
                            />
                        }
                    />
                </div> : <span></span>
            }

            <Box
                sx={{
                    height: '600px',
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
                    rowSelectionModel={selectedRows}
                    checkboxSelection
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slotProps={{
                        toolbar: {setRows, setRowModesModel},
                    }}
                    onRowSelectionModelChange={(ids) => {
                        setSelectedRows(ids as number[])
                    }}
                />
            </Box>
            <Button variant="contained"
                    sx={{width: '100%', marginTop: '10px'}}
                    onClick={() => createStorage()}>Отправить</Button>
        </>
    );
}
