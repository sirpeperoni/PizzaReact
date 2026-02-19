import Container from "@mui/material/Container";
import styles from "./register.module.css"
import { useAuthForm } from "../../Hooks/useAuthForm";
import { EmailInput } from "../../Components/EmailInput/EmailInput";
import { PasswordInput } from "../../Components/PasswordInput/PasswordInput";
import { Route } from "../../routes/__root";
import Button from "@mui/material/Button";
import { buttonStyle, textButtonStyle } from "../../Widgets/RegistrationFormActions/form_actions.material.style";
import { Link } from "@tanstack/react-router";
import { UsernameInput } from "../../Components/UsernameInput/UsernameInput";




export const Register = () => {
    const { formRef, isLoading, errors, handleSignUpSubmit } = useAuthForm();
    //const { redirect } = Route.useSearch()
    const navigate = Route.useNavigate()
    
    return (
        <Container maxWidth="xl" className={styles.container}>
            <div className={styles.title}>Регистрация</div>
            <form ref={formRef} className={styles.form} onSubmit={ async (e) => {
                const user = await handleSignUpSubmit(e)
                if(user){
                    navigate({ to: "/" })
                }
            }}>
                <EmailInput error={errors.email} /> 
                <UsernameInput error={errors.username}/>
                <PasswordInput 
                    name="password" 
                    placeholder="Password" 
                    error={errors.password}
                />
                <PasswordInput 
                    name="repeat-password" 
                    placeholder="Repeat password" 
                    error={errors.repeatPassword}
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
                        <Link to={"/login"}>Уже есть аккаут?</Link>
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
            </form>
        </Container>
    );
}