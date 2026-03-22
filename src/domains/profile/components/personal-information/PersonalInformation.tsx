import { Box, Button, Typography } from '@mui/material';
import { ProfileInput } from '../profile-input/ProfileInput';
import { useAuthStore } from '../../../auth/stores/authStore';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

interface FormUsernameData {
  username: string;
  email: string | null;
}

export const PersonalInformation = () => {
  const [edit, setEdit] = useState(false);

  const username = useAuthStore(state => state.user?.username);
  const email = useAuthStore(state => state.user?.email);
  const isLoading = useAuthStore(state => state.isLoading);

  const updateProfile = useAuthStore(state => state.updateProfile);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormUsernameData>({
    mode: 'onBlur',
    defaultValues: {
      username: username,
      email: email,
    },
  });

  const handleSetEdit = () => {
    setEdit(prev => !prev);
  };

  const handleCancelEdit = () => {
    reset({
      username: username,
    });
    setEdit(prev => !prev);
  };

  const handleOnSave: SubmitHandler<FormUsernameData> = async data => {
    try {
      updateProfile(data);
      setEdit(prev => !prev);
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  const handleSave = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleSubmit(handleOnSave)();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
      <Typography variant='h5'>Личные данные</Typography>
      <Typography>Имя</Typography>
      <Box sx={{ display: 'flex' }}>
        <Box component={'form'} onSubmit={handleSubmit(handleOnSave)}>
          <ProfileInput
            type='text'
            error={errors.username}
            disabled={!edit || isLoading}
            onEdit={handleSetEdit}
            onSave={handleSave}
            register={register('username', {
              required: 'Логин обязателен',
              minLength: {
                value: 6,
                message: 'Логин должен содержать минимум 6 символов',
              },
            })}
          />
        </Box>
        {edit && (
          <Button type='button' onClick={handleCancelEdit} variant='text'>
            Отменить
          </Button>
        )}
      </Box>
      <Typography>Email</Typography>
      <Box sx={{ display: 'flex' }}>
        <Box component={'form'} onSubmit={handleSubmit(handleOnSave)}>
          <ProfileInput type='email' register={register('email')} disabled={true} />
        </Box>
      </Box>
    </Box>
  );
};
