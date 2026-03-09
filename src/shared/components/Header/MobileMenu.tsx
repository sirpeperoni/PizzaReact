import { Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface MobileMenuProps {
  onOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

export const MobileMenu = ({ onOpen }: MobileMenuProps) => {
  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
      <IconButton
        size='large'
        aria-label='account of current user'
        aria-controls='menu-appbar'
        aria-haspopup='true'
        onClick={onOpen}
        color='inherit'>
        <MenuIcon />
      </IconButton>
    </Box>
  );
};
