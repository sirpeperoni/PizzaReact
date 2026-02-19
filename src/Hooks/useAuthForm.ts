import { useRef, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { useDispatch } from 'react-redux';
import { login, register } from '../store/authSlice';
import { type AppDispatch } from '../store/store'


interface FormErrors {
    email?: string;
    password?: string;
    repeatPassword?: string;
    username?: string;
}

export const useAuthForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [user, setUser] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const dispatch = useDispatch<AppDispatch>();

    
    const validateSignUpForm = (): boolean => {
        const newErrors: FormErrors = {};
        
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;
            const repeatPassword = formData.get('repeat-password') as string;
            const username = formData.get('username') as string;

            if (!email?.trim()) {
                newErrors.email = 'Требуется указать адрес электронной почты.';
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                newErrors.email = 'Адрес электронной почты недействителен.';
            }
            
            if (!password) {
                newErrors.password = 'Требуется пароль';
            } else if (password.length < 6) {
                newErrors.password = 'Пароль должен состоять как минимум из 6 символов.';
            }

            if (!repeatPassword) {
                newErrors.repeatPassword = 'Требуется повтор пароля';
            } else if (password !== repeatPassword) {
                newErrors.repeatPassword = 'Пароли не совпадают';
            }

            if(!username) {
                newErrors.username = 'Требуется логин';
            }
    
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        }

        return false;
    };

    const validateLoginForm = (): boolean => {
        const newErrors: FormErrors = {};
        
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;

            if (!email?.trim()) {
                newErrors.email = 'Требуется указать адрес электронной почты.';
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                newErrors.email = 'Адрес электронной почты недействителен.';
            }
            
            if (!password) {
                newErrors.password = 'Требуется пароль';
            } else if (password.length < 6) {
                newErrors.password = 'Пароль должен состоять как минимум из 6 символов.';
            }
    
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        }

        return false;
    };

    const handleSignUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateSignUpForm()) {
            return;
        }

        setIsLoading(true);

        if (formRef.current) {
            try {
                const formData = new FormData(formRef.current);
                const email = formData.get('email') as string;
                const password = formData.get('password') as string;
                const username = formData.get('username') as string;
                console.log(formData)
                const result = await dispatch(register({email, password, username, role: "User"}))
                console.log(result)
                return result.payload;
            } catch (error: FirebaseError | any) {
                const newErrors: FormErrors = {};
                if(error instanceof  FirebaseError){
                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            newErrors.email = 'Пользователь с таким Email уже существует';
                            break;
                        default:
                            newErrors.repeatPassword = 'Ошибка входа: ';
                            break;
                    }
                    setErrors(newErrors);
                } else {
                    return
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateLoginForm()) {
            return;
        }

        setIsLoading(true);

        if (formRef.current) {
            try {
                const formData = new FormData(formRef.current);
                const email = formData.get('email') as string;
                const password = formData.get('password') as string;
                const result = await dispatch(login({email, password}))
                return result.payload;
            } catch (error: FirebaseError | any) {
                const newErrors: FormErrors = {};
                if(error instanceof  FirebaseError){
                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            newErrors.email = 'Пользователь с таким Email уже существует';
                            break;
                        default:
                            newErrors.repeatPassword = 'Ошибка входа: ';
                            break;
                    }
                    setErrors(newErrors);
                } else {
                    return
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    return {
        formRef,
        isLoading,
        errors,
        user,
        handleSignUpSubmit,
        handleAuthSubmit
    };
};