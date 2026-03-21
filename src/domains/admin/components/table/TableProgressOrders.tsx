import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Alert, TablePagination } from "@mui/material";
import { useAdminStore } from "../../stores/adminStore";
import { useEffect, useMemo, useState } from "react";
import { OrderStatsChips } from "./OrderStatsChips";
import { OrderTableRow } from "./OrderTableRow";
import type { OrderStatus } from "../../types/types";
import { calculateStats } from "../../utils/utils";


export const TableProgressOrders = () => {
    const isLoading = useAdminStore((state) => state.isLoading);
    const orders = useAdminStore((state) => state.progressOrders);
    const error = useAdminStore((state) => state.error);
    const totalOrders = useAdminStore((state) => state.totalProgressOrders);
    const stats = calculateStats(orders);
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const updateOrderStatus = useAdminStore((state) => state.updateOrderStatus);
    
    const fetchProgressOrders = useAdminStore((state) => state.fetchProgressOrders);

    

    const handleStatusChange = async (userId: string, orderId: string, newStatus: OrderStatus) => {
        if (!orderId) return;
        
        try {
            setUpdatingOrderId(orderId);
            await updateOrderStatus(userId, orderId, newStatus);
            
        } catch (err) {
            console.error('Error updating order status:', err);
        } finally {
            setUpdatingOrderId(null);
        }
    };


    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    

    useEffect(() => {
        void fetchProgressOrders();
    }, []);


    const paginatedOrders = useMemo(() => {
        return orders.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );
    }, [orders, page, rowsPerPage]);


    return (
        <Box sx={{height: "100%"}}>
            <OrderStatsChips stats={stats} />

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
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Статус</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Изменить статус</TableCell>
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
                                <OrderTableRow
                                    key={order.id}
                                    order={order}
                                    updatingOrderId={updatingOrderId}
                                    isLoading={isLoading}
                                    onStatusChange={(orderId, newStatus) => 
                                        handleStatusChange(order.uid, orderId, newStatus)
                                    }
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