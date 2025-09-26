// src/redux/slices/budgetSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase'; // Import your initialized Supabase client

// Async thunk to fetch budgets
export const fetchBudgets = createAsyncThunk('budgets/fetchBudgets', async (_, { getState }) => {
  const { user } = getState().user;
  if (!user) return;

  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }
  return data;
});

// Async thunk to add a new budget
export const addBudget = createAsyncThunk('budgets/addBudget', async (budgetData, { getState }) => {
  const { user } = getState().user;
  if (!user) return;

  const { data, error } = await supabase
    .from('budgets')
    .insert([{ ...budgetData, user_id: user.id }])
    .select(); // .select() returns the inserted row

  if (error) {
    throw new Error(error.message);
  }
  return data[0]; // Return the newly created budget object
});

const budgetSlice = createSlice({
  name: 'budgets',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add Budget
      .addCase(addBudget.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default budgetSlice.reducer;