import { Alert, Box, Paper } from "@mui/material"
import { DataGrid, type GridColDef, type GridPaginationModel } from "@mui/x-data-grid"


interface OrderTableProps<T> {
    error: string | null,
    rows: T[],
    columns: GridColDef[],
    isLoading?: boolean,
    paginationModel?: GridPaginationModel,
    onPaginationChange?: (paginationModel: GridPaginationModel) => void
    rowCount: number;
}

export const OrderTable = <T,>({error, rows, columns, isLoading, paginationModel, onPaginationChange, rowCount}: OrderTableProps<T>) => {
    const handlePaginationChange = (newPaginationModel: GridPaginationModel) => {
        if (onPaginationChange) {
            onPaginationChange(newPaginationModel)
        }
    }
    return <Box sx={{ height: '100%' }}>
        {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
                {error}
            </Alert>
        )}

        <Paper>
            <DataGrid
                autoHeight
                rows={rows}
                columns={columns}
                loading={isLoading}
                getRowHeight={() => 'auto'}
                pagination
                paginationMode="server"
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
                onPaginationModelChange={handlePaginationChange}
                paginationModel={paginationModel}
                rowCount={rowCount}
            />
        </Paper>
    </Box>
}