import { configureStore} from '@reduxjs/toolkit'
import booksSlice from './slices/book/bookSlice'


export const store = configureStore({
    reducer: {
        book: booksSlice
    }
})