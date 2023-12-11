import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from '../../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateField } from '../../utils/validation';

export const AddBookPage = () => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        year: '',
    })

    const [formErrors, setFormErrors] = useState({
        title: '',
        author: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        let newValue

        if (name === 'year') {
            const parsedValue = parseInt(value, 10)
            newValue = isNaN(parsedValue) ? '' : Math.max(0, Math.min(parsedValue, 9999))
        } else {
            newValue = value
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }))
    }

    const validateForm = () => {
        const errors = {}

        Object.assign(errors, validateField(formData.title, 'title', 3, 100))
      
        Object.assign(errors, validateField(formData.author, 'author', 3, 100, true))
      
        setFormErrors(errors)
        const valid = Object.values(errors).every((error) => !error)
        return valid
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (validateForm()) {
            try {
                await axios.post('book', formData)
                sessionStorage.setItem('showToast', 'true');
                sessionStorage.setItem('toastMessage', 'Book added successfully');
                sessionStorage.setItem('toastType', 'success')

                navigate('/');
            } catch (error) {
                toast.error('Error adding book. Please try again.')
            }
        }
    }

    return (
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h2>Add Book</h2>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Title"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    error={Boolean(formErrors.title)}
                    helperText={formErrors.title}
                />
                <TextField
                    label="Author"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    error={Boolean(formErrors.author)}
                    helperText={formErrors.author}
                />
                <TextField
                    label="Year"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleInputChange}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '10px' }}>
                    Add Book
                </Button>
            </form>
            <ToastContainer />
        </Paper>
    )
};
