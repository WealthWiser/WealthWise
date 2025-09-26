import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

// Async thunk to fetch budgets
export const fetchBudgets = createAsyncThunk(
  'budgets/fetchBudgets',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to create a budget
export const createBudget = createAsyncThunk(
  'budgets/createBudget',
  async ({ userId, budgetData }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert([{
          user_id: userId,
          category: budgetData.category,
          amount: budgetData.amount,
          start_date: budgetData.start_date,
          end_date: budgetData.end_date,
        }])
        .select()
        .single();

      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to update a budget
export const updateBudget = createAsyncThunk(
  'budgets/updateBudget',
  async ({ budgetId, budgetData }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .update({
          category: budgetData.category,
          amount: budgetData.amount,
          start_date: budgetData.start_date,
          end_date: budgetData.end_date,
        })
        .eq('id', budgetId)
        .select()
        .single();

      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to delete a budget
export const deleteBudget = createAsyncThunk(
  'budgets/deleteBudget',
  async (budgetId, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budgetId);

      if (error) {
        return rejectWithValue(error.message);
      }

      return budgetId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to calculate spent amounts for budgets
export const calculateBudgetSpending = createAsyncThunk(
  'budgets/calculateSpending',
  async ({ userId, budgets }, { rejectWithValue }) => {
    try {
      const spentAmounts = {};
      
      for (const budget of budgets) {
        // Calculate spent amount for each budget based on transactions
        const { data: transactions, error } = await supabase
          .from('transactions')
          .select('amount, txn_date, category(*)')
          .eq('user_id', userId)
          .gte('txn_date', budget.start_date)
          .lte('txn_date', budget.end_date)
          .lt('amount', 0); // Only debit transactions (expenses)

        if (error) {
          console.warn(`Error fetching transactions for budget ${budget.id}:`, error.message);
          spentAmounts[budget.id] = 0;
          continue;
        }

        // Filter transactions by category matching budget category
        const categoryTransactions = transactions.filter(txn => 
          txn.category?.category?.toLowerCase().includes(budget.category.toLowerCase()) ||
          budget.category.toLowerCase() === 'general' || 
          budget.category.toLowerCase() === 'other'
        );

        const totalSpent = categoryTransactions.reduce((sum, txn) => sum + Math.abs(txn.amount), 0);
        spentAmounts[budget.id] = totalSpent;
      }

      return spentAmounts;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState: {
    data: [],
    spentAmounts: {},
    loading: false,
    error: null,
    creating: false,
    updating: false,
    deleting: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateSpentAmount: (state, action) => {
      const { budgetId, amount } = action.payload;
      state.spentAmounts[budgetId] = amount;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create budget
      .addCase(createBudget.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.creating = false;
        state.data.unshift(action.payload);
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      
      // Update budget
      .addCase(updateBudget.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.data.findIndex(budget => budget.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      
      // Delete budget
      .addCase(deleteBudget.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.deleting = false;
        state.data = state.data.filter(budget => budget.id !== action.payload);
        delete state.spentAmounts[action.payload];
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })
      
      // Calculate spending
      .addCase(calculateBudgetSpending.fulfilled, (state, action) => {
        state.spentAmounts = { ...state.spentAmounts, ...action.payload };
      });
  },
});

export const { clearError, updateSpentAmount } = budgetsSlice.actions;
export default budgetsSlice.reducer;