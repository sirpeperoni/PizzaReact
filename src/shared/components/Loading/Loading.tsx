import { Box, CircularProgress } from "@mui/material";

interface LoadingProps{
    height?: string
}

export const Loading = ({ height = '90vh'}: LoadingProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: height,
      }}>
          <CircularProgress size={24} color='inherit' />
    </Box>
  );
}