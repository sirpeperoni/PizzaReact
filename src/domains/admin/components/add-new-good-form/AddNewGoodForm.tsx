import { Box, Button, CircularProgress } from '@mui/material';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAdminStore } from '../../stores/adminStore';
import type { GoodItemInterface } from '../../../pizza/types/pizza.types';
import { doughs, type PizzaFormData, pizzaSchema, sizes } from './pizzaSchema';
import { BasicInfoSection } from './BasicInfoSection';
import { PricesSection } from './PricesSection';
import { DoughSection } from './DoughSection';
import { PreviewSection } from './PreviewSection';

export const AddNewGoodForm = () => {
  const addNewGoodToCategory = useAdminStore(state => state.addNewGoodToCategory);
  const isLoading = useAdminStore(state => state.isLoading);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
    watch,
    setValue,
  } = useForm<PizzaFormData>({
    resolver: zodResolver(pizzaSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      content: '',
      img: '',
      price: [0, 0, 0, 0],
      sizes: ['20 СМ', '25 СМ', '30 СМ', '35 СМ'],
      dough: ['Тонкое', 'Традиционное'],
    },
  });

  const watchPrices = watch('price') || [];
  const watchSizes = watch('sizes') || sizes;
  const watchDough = watch('dough') || doughs;
  const watchTitle = watch('title') || '';
  const watchContent = watch('content') || '';

  const handleOnSave: SubmitHandler<PizzaFormData> = async data => {
    try {
      console.log('Отправленные данные:', { ...data });
      void addNewGoodToCategory('pizza', data as GoodItemInterface);
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  const updatePrice = (index: number, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      const newPrices = [...watchPrices];
      newPrices[index] = numValue;
      setValue('price', newPrices);
    }
  };

  return (
    <Box component='form' sx={{ mt: 3, pl: 3, display: 'flex', gap: '16px' }} onSubmit={handleSubmit(handleOnSave)}>
      <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <BasicInfoSection register={register} errors={errors} isSubmitting={isSubmitting} />
        <PricesSection watchSizes={watchSizes} watchPrices={watchPrices} updatePrice={updatePrice} isSubmitting={isSubmitting} />
        <DoughSection watchDough={watchDough} />
      </Box>
      <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <PreviewSection
          watchTitle={watchTitle}
          watchSizes={watchSizes}
          watchDough={watchDough}
          watchPrices={watchPrices}
          watchContent={watchContent}
        />
        <Button
          type='submit'
          fullWidth
          variant='contained'
          disabled={!isValid || isSubmitting || isLoading}
          sx={{ borderRadius: 50, height: 45 }}>
          {isLoading ? <CircularProgress /> : 'Добавить'}
        </Button>
      </Box>
    </Box>
  );
};
