import { Menu, MenuItem, Typography } from "@mui/material";

interface NavigationMenuProps {
    anchorEl: HTMLElement | null;
    pages: string[];
    onClose: () => void;
}

export const NavigationMenu = ({ anchorEl, pages, onClose }: NavigationMenuProps) => {
    return (
      <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
          }}
          open={Boolean(anchorEl)}
          onClose={onClose}
          sx={{ display: { xs: 'block', md: 'none' } }}
      >
          {pages.map((page) => (
              <MenuItem key={page} onClick={onClose}>
              <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
              </MenuItem>
          ))}
      </Menu>
    );
};