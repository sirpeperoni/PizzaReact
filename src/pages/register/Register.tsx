import Container from '@mui/material/Container';
import styles from './Register.module.css';
import { RegisterForm } from '../../domains/auth/components/register-form/RegisterForm';
import { Box } from '@mui/material';

export const RegisterPage = () => {
  return (
    <Container maxWidth='xl' className={styles.container}>
      <Box className={styles.form}>
        <div className={styles.title}>Регистрация</div>
        <RegisterForm />
      </Box>
    </Container>
  );
};
