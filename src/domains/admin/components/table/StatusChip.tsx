import { Chip, CircularProgress } from "@mui/material";
import { statusConfig, type ChipColor, type OrderStatus } from "../../types/types";


interface StatusChipProps {
    status: OrderStatus;
    isUpdating: boolean;
}

export const StatusChip = ({ status, isUpdating }: StatusChipProps) => {
    const config = statusConfig[status];

    if (isUpdating) {
        return <CircularProgress size={24} />;
    }


    return (
        <Chip
            label={config.label}
            color={config.color as ChipColor}
            size="small"
            sx={{ fontWeight: 'medium' }}
        />
    );
};