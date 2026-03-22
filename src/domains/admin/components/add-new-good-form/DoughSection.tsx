import { Box, Stack, TextField, Typography } from '@mui/material';
import { BakeryDining } from '@mui/icons-material';

interface DoughSectionProps {
  watchDough: string[];
}

export const DoughSection = ({ watchDough }: DoughSectionProps) => {
  return (
    <>
      <Typography variant='h6' gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BakeryDining /> Типы теста
      </Typography>
      <Stack spacing={2}>
        {watchDough.map((dough, index) => (
          <Box key={index} display='flex' gap={2} alignItems='center'>
            <TextField fullWidth size='small' label={`Тип теста ${index + 1}`} value={dough} disabled={true} />
          </Box>
        ))}
      </Stack>
    </>
  );
};
