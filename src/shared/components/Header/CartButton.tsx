import { Chip } from "@mui/material";
import { useCartStore } from "../../../domains/cart/stores/cartStore";

interface CartButtonProps {
    onClick: () => void;
}

export const CartButton = ({ onClick }: CartButtonProps) => {
    const items = useCartStore((state) => state.items);
    const totalQuantity = useCartStore((state) => state.totalQuantity);
    const isLoading = useCartStore((state) => state.isLoading);

    return (
        <Chip
        label={`Корзина | ${totalQuantity}`}
        sx={{ ml: 2 }}
        onClick={onClick}
        disabled={isLoading}
        color={items.length === 0 ? "default" : "warning"}
        />
    );
};