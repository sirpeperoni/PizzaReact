import { Box, Button, Dialog, DialogContent, IconButton, List, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCallback } from 'react';
import { useCartStore } from '../../cart/stores/cartStore';
import type { CartItem, GoodItemInterface } from '../types/pizza.types';
import { useAuthStore } from '../../auth/stores/authStore';
import { Controller, useForm } from 'react-hook-form';

interface ModalGoodInterface {
  open: boolean;
  handleClose: () => void;
  data: GoodItemInterface | null;
}

interface FormValues {
  size: string;
  dough: string;
}

// const PIZZA_SIZES = [
//     { value: '0', label: '20 см', index: 0 },
//     { value: '1', label: '25 см', index: 1 },
//     { value: '2', label: '30 см', index: 2 },
//     { value: '3', label: '35 см', index: 3 },
// ] as const;

// const DOUGH_TYPES = [
//     { value: 'tradition', label: 'Традиционное' },
//     { value: 'thin', label: 'Тонкое' },
// ] as const;

const IMAGE_DIMENSIONS = {
  width: 584,
  height: 584,
} as const;

const DIALOG_SIZES = {
  width: {
    xs: '95%',
    sm: '800px',
    md: '1000px',
    lg: '1100px',
    xl: '1200px',
  },
  height: {
    xs: '650px',
    sm: '650px',
    md: '650px',
    lg: '650px',
    xl: '650px',
  },
} as const;

export const ModalGood = ({ open, handleClose, data }: ModalGoodInterface) => {
  const addToCart = useCartStore(state => state.addToCart);
  const isLoading = useCartStore(state => state.isLoading);
  const uid = useAuthStore(state => state.user?.uid);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      size: data?.sizes[0],
      dough: data?.dough[0],
    },
  });

  const selectedSize = watch('size');
  // const selectedDough = watch('dough');

  const currentPrice = useCallback(() => {
    const sizeIndex = data?.sizes.findIndex(size => size === selectedSize);
    return sizeIndex ? data?.price?.[sizeIndex] : data?.price?.[0];
  }, [selectedSize, data?.sizes]);

  const onSubmit = useCallback(
    async (formValues: FormValues) => {
      const sizeIndex = (data?.sizes ?? []).findIndex(size => size === formValues.size);
      const size = (data?.sizes ?? [])[sizeIndex];

      handleClose();

      if (data) {
        await addToCart({
          id: data.id,
          name: data.title,
          price: currentPrice(),
          image: data.img,
          quantity: 1,
          settings: {
            size: size,
            dough: formValues.dough,
          },
        } as CartItem);
      }
    },
    [currentPrice, handleClose, addToCart, uid, data],
  );

  return (
    <Box>
      <Dialog
        onClose={handleClose}
        open={open}
        maxWidth={false}
        PaperProps={{ sx: { borderRadius: 15 } }}
        sx={{
          '& .MuiDialog-paper': {
            width: DIALOG_SIZES.width,
            maxWidth: DIALOG_SIZES.width,
            height: DIALOG_SIZES.height,
            maxHeight: DIALOG_SIZES.height,
            m: 0,
          },
        }}>
        <DialogContent
          dividers
          sx={{
            display: 'flex',
            p: 3,
            height: '60vh',
            overflow: 'hidden',
          }}>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 20,
              top: 20,
              zIndex: 1401,
              color: 'black',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
              },
              width: 48,
              height: 48,
            }}>
            <CloseIcon />
          </IconButton>

          <Box sx={{ flexShrink: 0, mr: 3 }}>
            <img width={IMAGE_DIMENSIONS.width} src={data?.img} alt={data?.title} style={{ display: 'block' }} />
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: 'hidden',
              pr: 1,
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}>
              <List
                sx={{
                  height: '80%',
                  overflowY: 'auto',
                  pr: 1,
                }}>
                <Typography variant='h4' sx={{ fontWeight: 'bold' }} gutterBottom>
                  {data?.title}
                </Typography>
                <Typography gutterBottom>{data?.content}</Typography>

                <Stack spacing={1}>
                  <Controller
                    name='size'
                    control={control}
                    rules={{ required: 'Выберите размер пиццы' }}
                    render={({ field }) => (
                      <ToggleButtonGroup
                        {...field}
                        color='warning'
                        size='small'
                        fullWidth
                        exclusive
                        aria-label='pizza sizes'
                        onChange={(_, value) => value && field.onChange(value)}>
                        {(data?.sizes ?? []).map(value => (
                          <ToggleButton key={value} value={value}>
                            {value}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    )}
                  />
                  {errors.size && (
                    <Typography color='error' variant='caption'>
                      {errors.size.message}
                    </Typography>
                  )}

                  <Controller
                    name='dough'
                    control={control}
                    rules={{ required: 'Выберите тип теста' }}
                    render={({ field }) => (
                      <ToggleButtonGroup
                        {...field}
                        color='warning'
                        size='small'
                        fullWidth
                        exclusive
                        aria-label='dough types'
                        onChange={(_, value) => value && field.onChange(value)}>
                        {(data?.dough ?? []).map(value => (
                          <ToggleButton key={value} value={value}>
                            {value}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    )}
                  />
                  {errors.dough && (
                    <Typography color='error' variant='caption'>
                      {errors.dough.message}
                    </Typography>
                  )}

                  <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                    Добавить по вкусу
                  </Typography>
                </Stack>
              </List>

              <Box
                sx={{
                  height: '20%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 1,
                }}>
                <Button
                  type='submit'
                  sx={{
                    borderRadius: 15,
                    width: '100%',
                    height: '60%',
                    fontWeight: 'bold',
                  }}
                  disabled={isLoading}
                  color='warning'
                  variant='contained'>
                  В корзину за {currentPrice()} ₽
                </Button>
              </Box>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
