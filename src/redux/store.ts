import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import transactionsReducer from './slices/transactionSlice'
import statusBarColorReducer from './slices/statusbarColor';
import budgetsReducer from './slices/budgetSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        transactions: transactionsReducer,
        budgets: budgetsReducer,
        statusBarColor: statusBarColorReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
