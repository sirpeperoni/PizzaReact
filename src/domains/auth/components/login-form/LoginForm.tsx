import { useForm, type SubmitHandler} from "react-hook-form";
import type { LoginCredentials, RegisterData } from "../../types";
import { useAuthStore } from "../../stores/authStore";
import { PasswordInput } from "../password-input/PasswordInput";
import { EmailInput } from "../email-input/EmailInput";
import { SubmitButton } from "../submit-button/SubmitButton";
import { Box, Button } from "@mui/material";
import styles from './LoginForn.module.css'
import { Link } from "@tanstack/react-router";

export const LoginForm = () => {
    const login = useAuthStore((state) => state.login)
    const isLoading = useAuthStore((state) => state.isLoading)
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid }
    } = useForm<RegisterData>({
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<RegisterData> = async (data) => {
        try {
            login(data)
        } catch (error) {
            console.error('Ошибка входа:', error);
        }
    };

    return (
        <Box component="form" className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <EmailInput
                register={register}
                error={errors.email}
            />
            
            <PasswordInput
                register={register}
                error={errors.password}
            />

            <div className={styles.text__buttons}>
                <Button 
                    type="button" 
                    variant="text" 
                    sx={{fontSize: "9px"}}
                >
                    Забыли пароль?
                </Button>
                <Button 
                    type="button" 
                    variant="text" 
                    sx={{fontSize: "9px"}}
                >
                    <Link to={"/register"}>Нет аккаута?</Link>
                </Button>
            </div>

            <SubmitButton
                isSubmitting={isSubmitting}
                isLoading={isLoading}
                isValid={isValid}
            />
        </Box>
    )
}