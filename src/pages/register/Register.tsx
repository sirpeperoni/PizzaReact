import Container from "@mui/material/Container";
import styles from './Register.module.css'
import { RegisterForm } from "../../domains/auth/components/register-form/RegisterForm";



export const RegisterPage = () => {
    return (
        <Container maxWidth="xl" className={styles.container}>
            <div className={styles.title}>Регистрация</div>
            <RegisterForm/>
        </Container>
    );
}