import { Box, Button } from "@mui/material";

interface DesktopMenuProps {
    pages: string[];
    onClick: () => void;
}

export const DesktopMenu = ({ pages, onClick }: DesktopMenuProps) => {
    return (
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: "flex" } }}>
            {pages.map((page) => (
                <Button
                    key={page}
                    onClick={onClick}
                    sx={{ my: 2, color: 'black', fontWeight: "bold", display: 'block' }}
                >
                    {page}
                </Button>
            ))}
        </Box>
    );
};