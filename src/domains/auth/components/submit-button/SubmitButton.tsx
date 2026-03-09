import { Button, CircularProgress } from '@mui/material';

interface SubmitButtonProps {
  isSubmitting?: boolean;
  isLoading?: boolean;
  isValid?: boolean;
}

export const SubmitButton = ({ isSubmitting, isLoading, isValid }: SubmitButtonProps) => {
  const isDisabled = isSubmitting || isLoading || !isValid;

  return (
    <Button
      type='submit'
      fullWidth
      variant='contained'
      disabled={isDisabled}
      sx={{
        borderRadius: 50,
        height: 45,
      }}>
      {isSubmitting || isLoading ? <CircularProgress size={24} color='inherit' /> : 'Войти'}
    </Button>
  );
};
