import Container from "@mui/material/Container";
import styles from "./login.module.css"
import { useAuthForm } from "../../Hooks/useAuthForm";
import { EmailInput } from "../../Components/EmailInput/EmailInput";
import { PasswordInput } from "../../Components/PasswordInput/PasswordInput";
import { Route } from "../../routes/__root";
import Button from "@mui/material/Button";
import { buttonStyle, textButtonStyle } from "../../Widgets/RegistrationFormActions/form_actions.material.style";
import { Link } from "@tanstack/react-router";




export const Login = () => {
    const { formRef, isLoading, errors, handleAuthSubmit } = useAuthForm();
    const { redirect } = Route.useSearch()
    const navigate = Route.useNavigate()
    
    

    const handleForgotPassword = () => {

    };

    const handleLogin = () => {

    };
    return (
        <Container maxWidth="xl" className={styles.container}>
            <div className={styles.title}>Авторизация</div>
            <form ref={formRef} className={styles.form} onSubmit={ async (e) => {
                const user = await handleAuthSubmit(e)
                if(user){
                    navigate({ to: redirect })
                }
            }}>
                <EmailInput error={errors.email} /> 
                <PasswordInput 
                    name="password" 
                    placeholder="Password" 
                    error={errors.password}
                />
                <div className={styles.text__buttons}>
                    <Button 
                        type="button" 
                        variant="text" 
                        sx={textButtonStyle}
                    >
                        Забыли пароль?
                    </Button>
                    <Button 
                        type="button" 
                        variant="text" 
                        sx={textButtonStyle}
                    >
                        <Link to={"/register"}>Нет аккаута?</Link>
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
                        <span>Авторизация</span>
                    )}
                </Button>
            </form>
        </Container>
    );
}