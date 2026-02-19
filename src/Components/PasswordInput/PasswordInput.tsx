import React, { useState } from 'react';
import { FormControl, FormHelperText, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { inputStyle } from './password.material.style';
import styles from "./password.module.css"

interface PasswordInputProps {
    name?: string;
    placeholder?: string;
    error?: string;
}

export const PasswordInput = ({ 
    name, 
    placeholder, 
    error 
}: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <FormControl>
            <OutlinedInput 
                sx={inputStyle} 
                name={name} 
                placeholder={placeholder}
                type={showPassword ? 'text' : 'password'}
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
            />
            {error && (
                <FormHelperText>
                    <div className={styles.error__message} role="alert">
                        {error}
                    </div>
                </FormHelperText>
            )}
        </FormControl>
    );
};