import { Button, FormControl, FormHelperText, InputAdornment, OutlinedInput } from '@mui/material';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface ProfileInputProps {
  type: 'text' | 'email';
  disabled?: boolean;
  error?: FieldError;
  register?: UseFormRegisterReturn;
  onEdit?: () => void;
  onSave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ProfileInput = ({ type, error, disabled, onEdit, onSave, register }: ProfileInputProps) => {
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      if (onEdit) {
        onEdit();
      }
    } else {
      if (onSave) {
        onSave(e);
      }
    }
  };
  return (
    <FormControl>
      <OutlinedInput
        fullWidth
        sx={{
          borderRadius: 50,
          height: 50,
          width: 400,
          background: 'rgb(249, 250, 251)',
          '& input::placeholder': {
            fontSize: '14px',
            color: 'black',
          },
          '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px rgb(249, 250, 251) inset',
          },
        }}
        {...register}
        endAdornment={
          type === 'text' && (
            <InputAdornment position='end'>
              <Button type='button' onClick={handleButtonClick} variant='text'>
                {disabled ? 'Изменить' : 'Сохранить'}
              </Button>
            </InputAdornment>
          )
        }
        type={type}
        error={!!error}
        disabled={disabled}
      />
      {error && (
        <FormHelperText>
          <div role='alert'>{error.message}</div>
        </FormHelperText>
      )}
    </FormControl>
  );
};
