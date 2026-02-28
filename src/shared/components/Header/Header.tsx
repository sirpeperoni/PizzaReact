import { AppBar, Avatar, Box, Button, Chip, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from "@tanstack/react-router";
import { auth } from "../../firebase";
import { useAuthStore } from "../../../domains/auth/stores/authStore";
import { CartDrawer } from "../Drawer/Drawer";
import { useCartStore } from "../../../domains/cart/stores/cartStore";


const pages = ['Пиццы', 'Комбо', 'Закуски', 'Кофе', 'Напитки', 'Коктейли', 'Десерты'];

export const Header = () => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [firebaseRole, setFirebaseRole] = useState<string | null>(null);
    const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
    const router = useRouter();
    const items = useCartStore((state) => state.items)
    const totalQuantity = useCartStore((state) => state.totalQuantity)

    const logout = useAuthStore((state) => state.logout)
    const user = useAuthStore((state) => state.user)


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const idTokenResult = await user.getIdTokenResult();
                const role = idTokenResult.claims.role as string
                setFirebaseRole(role || null);
            } else {
                setFirebaseRole(null);
            }
        });
        
        return () => unsubscribe();
    }, []);
    
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = async () => {
        await logout();
        router.invalidate(); 
    };

    const getSettings = () => {
        const baseSettings = ['Профиль'];
        
        const isAdmin = firebaseRole === 'admin';
        
        if (isAdmin) {
            return [...baseSettings, 'Админка', 'Выход'];
        }
        
        return [...baseSettings, 'Выход'];
    };

    const handleUserMenuItemClick = (setting: string) => {
        handleCloseUserMenu(); 
        
        switch(setting) {
            case 'Профиль':
                
                break;
            case 'Админка':
                router.navigate({ to: '/admin' });
                break;
            case 'Выход':
                handleLogout();
                break;
            default:
                console.log('Unknown setting:', setting);
        }
    };

    const handleCartClick = () => {
        setCartDrawerOpen(true);
    };

    const handleCartClose = () => {
        setCartDrawerOpen(false);
    };

    return (
        <>
            <AppBar color="inherit" position="sticky">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <LocalPizzaIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}/>
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            PIZZA
                        </Typography>
                        <Box sx={{flexGrow: 1, display: { xs: 'flex', md: 'none'}}}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: 'block', md: 'none' } }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <LocalPizzaIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            PIZZA
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: "flex" } }}>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: 'black', fontWeight:"bold" , display: 'block' }}
                                >
                                    {page}
                                </Button>))
                            }
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title={user?.username}>
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                </IconButton>
                            </Tooltip>
                            
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {getSettings().map((setting) => (
                                    <MenuItem 
                                        key={setting}
                                        onClick={() => handleUserMenuItemClick(setting)}
                                    >
                                        <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <Chip 
                            label={`Корзина | ${totalQuantity}`} 
                            sx={{ml: 2}} 
                            onClick={() => {
                                handleCartClick()
                            }} 
                            color={items.length === 0 ? "default" : "warning"
                        }/>
                    </Toolbar>
                </Container>
            </AppBar>
            <CartDrawer open={cartDrawerOpen} onClose={handleCartClose} />
        </>
    )
}
