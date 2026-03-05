import { AppBar, Container,  Toolbar } from "@mui/material"
import { useState } from "react";
import { Profile } from "./Profile";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NavigationMenu } from "./NavigationMenu";
import { DesktopMenu } from "./DesktopMenu";
import { CartButton } from "./CartButton";
import { CartDrawer } from "../Drawer/Drawer";


const pages = ['Пиццы', 'Комбо', 'Закуски', 'Кофе', 'Напитки', 'Коктейли', 'Десерты'];

export const Header = () => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCartClick = () => {
        setCartDrawerOpen(true);
    };

    const handleCartClose = () => {
        setCartDrawerOpen(false);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <>
            <AppBar color="inherit" position="sticky">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Logo variant="desktop" />
                        
                        <MobileMenu onOpen={handleOpenNavMenu} />

                        <NavigationMenu 
                            anchorEl={anchorElNav} 
                            pages={pages} 
                            onClose={handleCloseNavMenu} 
                        />
                        
                        <Logo variant="mobile" />

                        <DesktopMenu pages={pages} onClick={handleCloseNavMenu} />

                        <Profile anchorEl={anchorElUser} onOpen={handleOpenUserMenu} onClose={handleCloseUserMenu}/>

                        <CartButton onClick={handleCartClick} />
                    </Toolbar>
                </Container>
            </AppBar>
            
            <CartDrawer open={cartDrawerOpen} onClose={handleCartClose} />
        </>
      )
}
