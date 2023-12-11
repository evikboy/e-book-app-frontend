import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBooks, editBook, deleteBook } from '../../redux/slices/book/bookSlice'

import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { validateField } from '../../utils/validation'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '4px',
    boxShadow: 24,
    p: 4,
}

export const MainPage = () => {
    const dispatch = useDispatch()
    const { books, error } = useSelector((state) => state.book)

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('')

    React.useEffect(() => {
        const storedShowToast = sessionStorage.getItem('showToast') === 'true'
        const storedToastMessage = sessionStorage.getItem('toastMessage')
        const storedToastType = sessionStorage.getItem('toastType')
        setShowToast(storedShowToast)
        setToastMessage(storedToastMessage)
        setToastType(storedToastType)

        sessionStorage.removeItem('showToast')
        sessionStorage.removeItem('toastMessage')
        sessionStorage.removeItem('toastType')
    }, [])

    const [isLoading, setIsLoading] = useState(true)

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchBooks())
                setIsLoading(false)
                if (showToast) {
                    toast.success(toastMessage, {
                        type: toastType,
                        autoClose: 3000,
                    })
                }
            } catch (err) {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [dispatch, showToast, toastMessage, toastType])

    const [open, setOpen] = React.useState(false)
    const [selectedBook, setSelectedBook] = useState(null)
    const [modalType, setModalType] = useState(null)

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        year: '',
    })

    const [formErrors, setFormErrors] = useState({
        title: '',
        author: '',
    })

    const handleOpen = (book, modalType) => {
        setSelectedBook(book)
        setModalType(modalType)
        setOpen(true)
        setFormData({
            title: book.title,
            author: book.author,
            year: book.year,
        })
        setFormErrors({
            title: '',
            author: '',
        })
    }

    const handleClose = () => {
        setSelectedBook(null)
        setModalType(null)
        setOpen(false)
    }

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

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (modalType === 'edit') {
            const errors = {}
            Object.assign(errors, validateField(formData.title, 'title', 3, 100))
            Object.assign(errors, validateField(formData.author, 'author', 3, 100, true))
            setFormErrors(errors)

            if (!errors.title && !errors.author) {
                const { _id: bookId } = selectedBook
                
                const data = await dispatch(editBook({ bookId, updatedBook: formData }))
                console.log(data)
                
                if (!data?.error) {
                    toast.success('Book was edited successfully', {
                        autoClose: 3000,
                    })
                } else {
                    toast.error(data?.payload?.error, {
                        autoClose: 3000,
                    })
                }

                handleClose()
            }
        } else if (modalType === 'delete') {
            const data = await dispatch(deleteBook(selectedBook._id))
            if (!data.error) {
                toast.success('Book deleted successfully', {
                    autoClose: 3000,
                })
            } else {
                toast.error(data?.payload?.error, {
                    autoClose: 3000,
                })
            }
            handleClose()
        }
    }


    return (
        <>
            {error === `Cannot read properties of undefined (reading 'data')` ? (
                <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '20px' }}>
                    An error occurred while fetching books
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    {isLoading ? (
                        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '20px' }}>
                            Loading...
                        </Typography>
                    ) : books.length > 0 ? (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: '10%' }}>#</TableCell>
                                    <TableCell sx={{ width: '20%' }}>Title</TableCell>
                                    <TableCell sx={{ width: '20%' }}>Author</TableCell>
                                    <TableCell sx={{ width: '20%' }}>Year</TableCell>
                                    <TableCell sx={{ width: '20%' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {books.map((book, index) => (
                                    <TableRow key={book.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{book.title}</TableCell>
                                        <TableCell>{book.author}</TableCell>
                                        <TableCell>{book.year}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="primary" onClick={() => handleOpen(book, 'edit')} sx={{ marginRight: '15px' }}>
                                                Edit
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => handleOpen(book, 'delete')}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '20px' }}>
                            No books found in the database
                        </Typography>
                    )}

                    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                {modalType === 'edit' ? 'Edit Book' : 'Delete Book'}
                            </Typography>
                            {selectedBook && (
                                <form onSubmit={handleSubmit}>
                                    {modalType === 'edit' && (
                                        <>
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
                                                Save Changes
                                            </Button>
                                        </>
                                    )}

                                    {modalType === 'delete' && (
                                        <>
                                            <Typography id="confirmation-modal-description" sx={{ marginTop: '10px' }}>
                                                Are you sure you want to delete this book?
                                            </Typography>
                                            <Button onClick={handleClose} sx={{ marginRight: '10px', marginTop: '20px' }}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleSubmit} variant="contained" color="error" sx={{ marginTop: '20px' }}>
                                                Confirm Delete
                                            </Button>
                                        </>
                                    )}
                                </form>
                            )}
                        </Box>
                    </Modal>
                </TableContainer>
            )}
            <ToastContainer />
        </>
    )
}
