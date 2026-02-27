import { FormControl, FormHelperText, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { type FieldError, type UseFormRegister } from 'react-hook-form';
import type { RegisterData } from '../../types';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PasswordFieldProps {
    register: UseFormRegister<RegisterData>;
    error?: FieldError;
    placeholder?: string,
    id?: string
}

export const PasswordInput = ({ register, error, id, placeholder }: PasswordFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    
    return (
        <FormControl>
            <OutlinedInput 
                fullWidth
                id={id}
                type={showPassword ? 'text' : 'password'}
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
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            sx={{marginRight: "1px"}}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                autoComplete="current-password"
                error={!!error}
                placeholder={placeholder}
                {...register('password', {
                    required: 'Пароль обязателен',
                    minLength: {
                        value: 6,
                        message: 'Пароль должен содержать минимум 6 символов',
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