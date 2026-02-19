import {RouterProvider } from '@tanstack/react-router'
import './App.css'
import { router } from './router'
import { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { clearUser, getCurrentUser } from './store/authSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store, type AppDispatch, type RootState } from './store/store';
import { auth } from './firebase';


function AppContent() {
    const dispatch = useDispatch<AppDispatch>();

    const authState = useSelector((state: RootState) => {
        return state.auth
    });
    
    useEffect(() => {
      dispatch(getCurrentUser());
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          await dispatch(getCurrentUser());
        } else {
          dispatch(clearUser());
        }
      });
  
      return () => unsubscribe();
    }, [dispatch]);

    if (authState.isLoading) {
      return <div className="center">
        <span className="spinner"></span>
      </div>;
    }

    return (
      <RouterProvider 
        router={router} 
        context={{ 
          auth: authState 
        }} 
      />
    );
}

function App() {
  return (
    <>
      <Provider store={store}>
          <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
              <AppContent />
          </PersistGate>
      </Provider>
    </>
  )
}

export default App
