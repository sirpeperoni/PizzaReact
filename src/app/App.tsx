import { RouterProvider } from '@tanstack/react-router';
import './App.css'
import { router } from './router';
import { useEffect } from 'react';
import { useAuthStore } from '../domains/auth/stores/authStore';
import { Box, CircularProgress } from '@mui/material';


function App() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const initAuth = useAuthStore((state) => state.initAuth)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [initAuth])

  if (isLoading) {
    return (
      <Box sx={{display: "flex", alignItems:"center", justifyContent:"center", height: "90vh"}}>
        <CircularProgress size={24} color="inherit" />
      </Box>
    );
  }
  
  return (
    <RouterProvider
        router={router}
        context={{
          user 
        }}
    />
  )
}

export default App
