import { Button } from '@mui/material';
import { textButtonStyle, buttonStyle } from './form_actions.material.style';
import styles from './form.module.css';

interface FormActionsProps {
    isLoading: boolean;
    onForgotPassword?: () => void;
    onLogin?: () => void;
}

export const FormActions= ({ 
    isLoading, 
    onForgotPassword, 
    onLogin 
}: FormActionsProps) => {
    return (
        <>
            <div className={styles.text__buttons}>
                <Button 
                    type="button" 
                    variant="text" 
                    sx={textButtonStyle}
                    onClick={onForgotPassword}
                >
                    Забыли пароль?
                </Button>
                <Button 
                    type="button" 
                    variant="text" 
                    sx={textButtonStyle}
                    onClick={onLogin}
                >
                    Авторизоваться
                </Button>
            </div>
            <Button 
                sx={buttonStyle} 
                type="submit" 
                disabled={isLoading} 
                variant="contained"
            >
                {isLoading ? (
                    <span className={styles.spinner}></span>
                ) : (
                    <span>Зарегистрироваться</span>
                )}
            </Button>
        </>
    );
};