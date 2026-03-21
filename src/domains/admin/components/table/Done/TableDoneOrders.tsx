import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Alert, TablePagination } from "@mui/material";
import { useAdminStore } from "../../../stores/adminStore";
import { useEffect, useMemo, useState } from "react";
import { OrderDoneTableRow } from "./OrderDoneTableRow";


export const TableDoneOrders = () => {
    const isLoading = useAdminStore((state) => state.isLoading);
    const orders = useAdminStore((state) => state.doneOrders);
    const error = useAdminStore((state) => state.error);
    const totalOrders = useAdminStore((state) => state.totalDoneOrders);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchDoneOrders = useAdminStore((state) => state.fetchDoneOrders);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const paginatedOrders = useMemo(() => {
        return orders.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );
    }, [orders, page, rowsPerPage]);

    useEffect(() => {
        void fetchDoneOrders();
    }, []);


    


    return (
        <Box sx={{height: "100%"}}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TableContainer sx={{ 
                maxHeight: 'calc(100vh - 135px)',
                overflow: 'auto' ,
            }} component={Paper}>
                <Table>
                    <TableHead >
                        <TableRow sx={{ backgroundColor: 'primary.main' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID Заказа</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Дата</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Товары</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Сумма</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading && orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <CircularProgress />
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Загрузка заказов...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : paginatedOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Нет активных заказов
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedOrders.map((order) => (
                                <OrderDoneTableRow
                                    key={order.id}
                                    order={order}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>


                <Box
                    sx={{
                        position: 'sticky',
                        bottom: -2,
                        bgcolor: 'background.paper',
                        borderTop: 1,
                        borderColor: 'divider',
                        zIndex: 1,
                    }}
                >
                    <TablePagination
                        component="div"
                        rowsPerPageOptions={[9]}
                        count={totalOrders}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        labelRowsPerPage=""
                        labelDisplayedRows={({ from, to, count }) => 
                            `${from}-${to} из ${count}`
                        }
                    />
                </Box>
                
            </TableContainer>
        </Box>
    );
};