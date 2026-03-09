import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../domains/auth/stores/authStore';
import { useRouter } from '@tanstack/react-router';
import { auth } from '../../firebase';

interface ProfileProps {
  anchorEl: HTMLElement | null;
  onOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onClose: () => void;
}

export const Profile = ({ anchorEl, onOpen, onClose }: ProfileProps) => {
  const [firebaseRole, setFirebaseRole] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);
  const router = useRouter();
  const logout = useAuthStore(state => state.logout);
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

  const getSettings = () => {
    const baseSettings = ['Профиль'];

    const isAdmin = firebaseRole === 'admin';

    if (isAdmin) {
      return [...baseSettings, 'Админка', 'Выход'];
    }

    return [...baseSettings, 'Выход'];
  };

  const handleUserMenuItemClick = (setting: string) => {
    onClose();

    switch (setting) {
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

  const handleLogout = async () => {
    await logout();
    router.invalidate();
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title={user?.username}>
        <IconButton onClick={onOpen} sx={{ p: 0 }}>
          <Avatar alt='Remy Sharp' src='/static/images/avatar/2.jpg' />
        </IconButton>
      </Tooltip>

      <Menu
        sx={{ mt: '45px' }}
        id='menu-appbar'
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={onClose}>
        {getSettings().map(setting => (
          <MenuItem key={setting} onClick={() => handleUserMenuItemClick(setting)}>
            <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
