import { FormControl, FormHelperText,  OutlinedInput } from '@mui/material';
import { type FieldError, type UseFormRegister, type UseFormRegisterReturn } from 'react-hook-form';
import type { LoginCredentials, RegisterData } from '../../types';

interface FieldProps {
    register: UseFormRegisterReturn; 
    error?: FieldError;
    id?: string;
    type?: string;
    placeholder?: string;
    autoComplete?: string;
}

export const Input = ({ 
    register, 
    error, 
    id, 
    type = 'text', 
    placeholder, 
    autoComplete 
}: FieldProps ) => {    
    return (
        <FormControl>
            <OutlinedInput 
                fullWidth
                sx={{
                    borderRadius: 50, 
                    height: 50,
                    background: "rgb(249, 250, 251)",
                    "& input::placeholder": {
                        fontSize: "14px",
                        color: "black"
                    },
                    '& input:-webkit-autofill': {
                        WebkitBoxShadow: "0 0 0 1000px rgb(249, 250, 251) inset"
                    }
                }}      
                id={id}
                type={type}
                autoComplete={autoComplete}
                error={!!error}
                placeholder={placeholder}
                {...register}
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