import Container from "@mui/material/Container";
import { LoginForm } from "../../domains/auth/components/login-form/LoginForm";
import styles from './Login.module.css'
import { Box } from "@mui/material";



export const Login = () => {
    return (
        <Container maxWidth="xl" className={styles.container}>
            <Box className={styles.form}>
                <div className={styles.title}>Авторизация</div>
                <LoginForm/>
            </Box>
        </Container>
    );
}