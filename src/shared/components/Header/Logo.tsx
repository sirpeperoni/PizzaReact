import { Box, Typography } from '@mui/material';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import { useRouter } from '@tanstack/react-router';

interface LogoProps {
  variant: 'mobile' | 'desktop';
}

export const Logo = ({ variant }: LogoProps) => {
  const isDesktop = variant === 'desktop';
  const router = useRouter();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        ...(variant === 'mobile' && {
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }),
      }}
      onClick={
        () => router.navigate({ to: '/home' })
      }
    >
      <LocalPizzaIcon
        sx={{
          display: {
            xs: isDesktop ? 'none' : 'flex',
            md: isDesktop ? 'flex' : 'none',
          },
          mr: 1,
        }}
      />
      <Typography
        variant='h5'
        noWrap
        component='a'
        href='#app-bar-with-responsive-menu'
        sx={{
          ...(isDesktop
            ? { display: { xs: 'none', md: 'flex' } }
            : {
                mr: 2,
                display: { xs: 'flex', md: 'none' },
              }),
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
      }}>
        PIZZA
      </Typography>
    </Box>
  );
};
