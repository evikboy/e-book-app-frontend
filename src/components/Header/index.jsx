import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

export const Header = () => {
    const navigate = useNavigate() 

    const goToAddBook = () => {
        navigate('/addBook')
    }

    return (
        <header className={styles.header}>
            <Container maxWidth="lg" sx={{display: 'flex', justifyContent: 'space-between'}} className={styles.container}>
                <Link to={'/'} style={{ textDecoration: 'none' }} >
                    <h1 className={styles.logo}>E-book-app</h1>
                </Link>

                <Button variant="outlined" className={styles.addButton} onClick={goToAddBook}>
                    Add book
                </Button>
            </Container>
        </header>
    );
};

export default Header;