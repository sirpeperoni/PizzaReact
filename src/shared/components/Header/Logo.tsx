import { Typography } from "@mui/material";
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';

interface LogoProps {
    variant: 'mobile' | 'desktop';
}

export const Logo = ({ variant }: LogoProps) => {
    const isDesktop = variant === 'desktop';
    
    return (
        <>
            <LocalPizzaIcon sx={{ display: { xs: isDesktop ? 'none' : 'flex', md: isDesktop ? 'flex' : 'none' }, mr: 1 }} />
            <Typography
                variant="h5"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                ...(isDesktop ? { display: { xs: 'none', md: 'flex' } } : { 
                    mr: 2,
                    display: { xs: 'flex', md: 'none' },
                    flexGrow: 1 
                }),
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                }}
            >
                PIZZA
            </Typography>
        </>
    );
};