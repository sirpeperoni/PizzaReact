import { FormControl, FormHelperText, OutlinedInput } from '@mui/material';
import { inputStyle } from './username.material.style';
import styles from './username.module.css'

interface UsernameInputProps {
    error?: string;
}

export const UsernameInput = ({ error }: UsernameInputProps) => {
    return (
        <FormControl>
            <OutlinedInput 
                sx={inputStyle} 
                name="username" 
                placeholder="Login"
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