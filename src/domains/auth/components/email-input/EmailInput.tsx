import { FormControl, FormHelperText,  OutlinedInput } from '@mui/material';
import { type FieldError, type UseFormRegister } from 'react-hook-form';
import type { LoginCredentials, RegisterData } from '../../types';

interface EmailFieldProps {
    register: UseFormRegister<RegisterData>;
    error?: FieldError;
}

export const EmailInput = ({ register, error }: EmailFieldProps ) => {    
    return (
        <FormControl>
            <OutlinedInput 
                fullWidth
                sx={{
                    borderRadius: 50, 
                    height: 50,
                    background: "rgb(249, 250, 251)",
                    "& input::placeholder": {
                        fontSize: "14px"
                    },
                    '& input:-webkit-autofill': {
                        WebkitBoxShadow: "0 0 0 1000px rgb(249, 250, 251) inset"
                    },
                }}      
                id="email"
                autoComplete="email"
                error={!!error}
                {...register('email', {
                    required: 'Email обязателен',
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Некорректный email адрес'
                    }
                })}
            />
            {error && (
                <FormHelperText>
                    <div role="alert">
                        {error.message}
                    </div>
                </FormHelperText>
            )}
        </FormControl>  
    );
};