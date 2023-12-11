import React, { useEffect }  from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { AddBookPage } from './pages/AddBookPage';
import { Header } from './components/Header';

import Container from '@mui/material/Container';

import './App.css';

function App() {
    const location = useLocation();
    const isUnregisteredPath = !['/', '/addBook'].includes(location.pathname)

    useEffect(() => {
      if (isUnregisteredPath) {
        sessionStorage.setItem('showToast', 'true');
        sessionStorage.setItem('toastMessage', 'Page not found');
        sessionStorage.setItem('toastType', 'error')
      }
    }, [isUnregisteredPath])

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ marginTop: '40px' }}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/addBook" element={<AddBookPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
