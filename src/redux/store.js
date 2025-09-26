import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import transactionsReducer from './slices/transactionSlice'
import statusBarColorReducer from './slices/statusbarColor';
export const store = configureStore({
    reducer: {
        user: userReducer,
        transactions: transactionsReducer,
        statusBarColor: statusBarColorReducer
    },
});
