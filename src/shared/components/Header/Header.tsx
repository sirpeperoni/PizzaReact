import { AppBar, Container, Toolbar } from '@mui/material';
import { useState, useEffect } from 'react';
import { ProfileIcon } from './ProfileIcon';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { NavigationMenu } from './NavigationMenu';
import { DesktopMenu } from './DesktopMenu';
import { CartButton } from './CartButton';
import { ChatButton } from './ChatButton';
import { CartDrawer } from '../Drawer/Drawer';
import { UserChatDrawer } from '../../../domains/chat/components/user-chat/UserChatDrawer';
import { useAuthStore } from '../../../domains/auth/stores/authStore';
import { useChatStore } from '../../../domains/chat/stores/chatStore';
import { auth } from '../../firebase';

const pages = ['Пиццы', 'Комбо', 'Закуски', 'Кофе', 'Напитки', 'Коктейли', 'Десерты'];

export const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState<boolean>(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [firebaseRole, setFirebaseRole] = useState<string | null>(null);

  const user = useAuthStore(state => state.user);
  const subscribeUserChats = useChatStore(state => state.subscribeUserChats);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const role = idTokenResult.claims.role as string;
        setFirebaseRole(role || null);
      } else {
        setFirebaseRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = firebaseRole === 'admin';

  useEffect(() => {
    if (!user?.uid || isAdmin) return;
    const unsubscribe = subscribeUserChats(user.uid);
    return () => unsubscribe();
  }, [user?.uid, isAdmin]);

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

  const handleChatClick = () => {
    setChatDrawerOpen(true);
  };

  const handleChatClose = () => {
    setChatDrawerOpen(false);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar color='inherit' position='sticky'>
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            <Logo variant='desktop' />

            <MobileMenu onOpen={handleOpenNavMenu} />

            <NavigationMenu anchorEl={anchorElNav} pages={pages} onClose={handleCloseNavMenu} />

            <Logo variant='mobile' />

            <DesktopMenu pages={pages} onClick={handleCloseNavMenu} />

            <ProfileIcon anchorEl={anchorElUser} onOpen={handleOpenUserMenu} onClose={handleCloseUserMenu} firebaseRole={firebaseRole} />

            {!isAdmin && <ChatButton onClick={handleChatClick} />}

            <CartButton onClick={handleCartClick} />
          </Toolbar>
        </Container>
      </AppBar>

      <CartDrawer open={cartDrawerOpen} onClose={handleCartClose} />
      {!isAdmin && <UserChatDrawer open={chatDrawerOpen} onClose={handleChatClose} />}
    </>
  );
};
