import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

const initialState = {
    books: [],
    isLoading: false,
    error: null,
}

export const fetchBooks = createAsyncThunk(
    'book/fetchBooks',
    async(_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('book')
            return data
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
)

export const addBook = createAsyncThunk(
    'book/addBook',
    async (newBook, { rejectWithValue }) => {
        try {
            const { data } = await axios.post('book', newBook)
            return data
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
)


export const editBook = createAsyncThunk(
    'book/editBook',
    async ({ bookId, updatedBook }, { rejectWithValue }) => {
        try {
            const { data } = await axios.patch(`book/${bookId}`, updatedBook)
            return data
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
)

export const deleteBook = createAsyncThunk(
    'book/deleteBook',
    async (bookId, { rejectWithValue }) => {
        try {
            await axios.delete(`book/${bookId}`)
            return bookId
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
)

const booksSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBooks.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.isLoading = false
                state.books = action.payload
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message
            })

            .addCase(addBook.pending, (state) => {
                state.isLoading = true
            })
            .addCase(addBook.fulfilled, (state, action) => {
                state.books.push(action.payload)
            })
            .addCase(addBook.rejected, (state, action) => {
                state.error = action.error.message
            })

            .addCase(editBook.pending, (state) => {
                state.isLoading = true
            })
            .addCase(editBook.fulfilled, (state, action) => {
                const index = state.books.findIndex((book) => book._id === action.payload._id)
                state.books[index] = action.payload
                state.isLoading = false
            })
            .addCase(editBook.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message
            })

            .addCase(deleteBook.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteBook.fulfilled, (state, action) => {
                state.isLoading = false
                state.books = state.books.filter((book) => book._id !== action.payload)
            })
            .addCase(deleteBook.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message
            })

    },
})

export default booksSlice.reducer