import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import transactionsReducer from './slices/transactionSlice'
import statusBarColorReducer from './slices/statusbarColor';
import budgetReducer from './slices/budgetSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        transactions: transactionsReducer,
        budgets: budgetReducer,
        statusBarColor: statusBarColorReducer
    },
});
