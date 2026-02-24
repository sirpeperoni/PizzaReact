import Container from "@mui/material/Container";
import { LoginForm } from "../../domains/auth/components/login-form/LoginForm";
import styles from './Login.module.css'



export const Login = () => {
    return (
        <Container maxWidth="xl" className={styles.container}>
            <div className={styles.title}>Авторизация</div>
            <LoginForm/>
        </Container>
    );
}