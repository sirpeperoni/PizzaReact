import { FormControl, FormHelperText, OutlinedInput } from '@mui/material';
import { inputStyle } from './email.material.style';
import styles from './email.module.css'

interface EmailInputProps {
    error?: string;
}

export const EmailInput = ({ error }: EmailInputProps) => {
    return (
        <FormControl>
            <OutlinedInput 
                sx={inputStyle} 
                name="email" 
                placeholder="Email"
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