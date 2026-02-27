import { useForm, type SubmitHandler} from "react-hook-form";
import type { LoginCredentials, RegisterData } from "../../types";
import { useAuthStore } from "../../stores/authStore";
import { PasswordInput } from "../password-input/PasswordInput";
import { Input } from "../input/Input";
import { SubmitButton } from "../submit-button/SubmitButton";
import { Box, Button, Typography } from "@mui/material";
import styles from './RegisterForn.module.css'
import { Link } from "@tanstack/react-router";

export const RegisterForm = () => {
    const isLoading = useAuthStore((state) => state.isLoading)
    const registerProfile = useAuthStore((state) => state.registerProfile)
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid }
    } = useForm<RegisterData>({
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: '',
            username: ''
        },
    });

    const onSubmit: SubmitHandler<RegisterData> = async (data) => {
        try {
            registerProfile(data)
        } catch (error) {
            console.error('Ошибка входа:', error);
        }
    };

    return (
        <Box component="form" className={styles.form} onSubmit={handleSubmit(onSubmit)}>

            <Input
                register={register('email', {
                    required: 'Email обязателен',
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Некорректный email адрес'
                    }
                })}
                placeholder="Email"
                type="email"
                id={"email"}
                error={errors.email}
            />

            <Input
                register={register('username', {
                    required: 'Логин обязателен',
                    minLength: {
                        value: 6,
                        message: 'Логин должен содержать минимум 6 символов',
                    }
                })}
                placeholder="Логин"
                id={"username"}
                error={errors.username}
            />
            
            <PasswordInput
                register={register}
                error={errors.password}
                placeholder="Пароль"
                id={"password"}
            />

            <PasswordInput
                register={register}
                error={errors.password}
                placeholder="Повторите пароль"
                id={"repeat-password"}
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
                    <Link to={"/login"}>Есть аккаут?</Link>
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