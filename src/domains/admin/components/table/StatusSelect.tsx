import { Select, MenuItem, Chip, type SelectChangeEvent,  } from "@mui/material";
import { Kitchen, CheckCircle, LocalShipping, DoneAll } from "@mui/icons-material";
import type { OrderStatus } from "../../types/types";

interface StatusSelectProps {
    currentStatus: OrderStatus;
    orderId: string;
    isDisabled: boolean;
    onStatusChange: (newStatus: OrderStatus) => void;
}

export const StatusSelect = ({ 
    currentStatus, 
    orderId, 
    isDisabled, 
    onStatusChange 
}: StatusSelectProps) => {
    if (currentStatus === 'delivered') {
        return (
            <Chip 
                icon={<DoneAll />} 
                label="Завершен" 
                color="success" 
                size="small" 
                variant="outlined"
            />
        );
    }

    return (
        <Select
            value={currentStatus}
            onChange={(e: SelectChangeEvent) => 
                onStatusChange(e.target.value as OrderStatus)
            }
            size="small"
            disabled={isDisabled}
            sx={{ minWidth: 130 }}
        >
            <MenuItem value="cooking">
                <Chip 
                    icon={<Kitchen />} 
                    label="Готовится" 
                    size="small" 
                    variant="outlined" 
                />
            </MenuItem>
            <MenuItem value="ready">
                <Chip 
                    icon={<CheckCircle />} 
                    label="Готов" 
                    size="small" 
                    variant="outlined" 
                />
            </MenuItem>
            <MenuItem value="in_delivery">
                <Chip 
                    icon={<LocalShipping />} 
                    label="В доставке" 
                    size="small" 
                    variant="outlined" 
                />
            </MenuItem>
            <MenuItem value="delivered">
                <Chip 
                    icon={<DoneAll />} 
                    label="Доставлен" 
                    size="small" 
                    variant="outlined" 
                />
            </MenuItem>
        </Select>
    );
};