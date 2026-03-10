import { RouterProvider } from '@tanstack/react-router';
import './App.css';
import { router } from './router';
import { useEffect } from 'react';
import { useAuthStore } from '../domains/auth/stores/authStore';
import { Loading } from '../shared/components/Loading/Loading';

function App() {
  const isLoading = useAuthStore(state => state.isLoading);
  const initAuth = useAuthStore(state => state.initAuth);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [initAuth]);

  if(isLoading){
    return <Loading/>
  }

  return (
    <RouterProvider
      router={router}
      context={{
        user,
      }}
    />
  );
}

export default App;
