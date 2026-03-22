import { InputAdornment, TextField, Typography } from '@mui/material';
import { Description, Image, Title } from '@mui/icons-material';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { PizzaFormData } from './pizzaSchema';

interface BasicInfoSectionProps {
  register: UseFormRegister<PizzaFormData>;
  errors: FieldErrors<PizzaFormData>;
  isSubmitting: boolean;
}

export const BasicInfoSection = ({ register, errors, isSubmitting }: BasicInfoSectionProps) => {
  return (
    <>
      <Typography variant='h6' gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        Основная информация
      </Typography>
      <TextField
        fullWidth
        label='Название пиццы'
        {...register('title')}
        error={!!errors.title}
        helperText={errors.title?.message}
        disabled={isSubmitting}
        variant='outlined'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Title color='action' />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        label='Описание'
        {...register('content')}
        error={!!errors.content}
        helperText={errors.content?.message}
        multiline
        rows={3}
        disabled={isSubmitting}
        variant='outlined'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Description color='action' />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        label='Имя файла изображения'
        {...register('img')}
        error={!!errors.img}
        helperText={errors.img?.message || 'Формат: jpg, jpeg, png, webp'}
        disabled={isSubmitting}
        variant='outlined'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Image color='action' />
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};
