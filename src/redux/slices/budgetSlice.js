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
  },
);

// Async thunk to create a budget
export const createBudget = createAsyncThunk(
  'budgets/createBudget',
  async ({ userId, budgetData }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert([
          {
            user_id: userId,
            category: budgetData.category,
            amount: budgetData.amount,
            start_date: budgetData.start_date,
            end_date: budgetData.end_date,
          },
        ])
        .select()
        .single();

      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
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
  },
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
  },
);

// Async thunk to calculate spent amounts for budgets
export const calculateBudgetSpending = createAsyncThunk(
  'budgets/calculateSpending',
  async ({ userId, budgets }, { rejectWithValue }) => {
    try {
      const spentAmounts = {};

      if (!Array.isArray(budgets) || budgets.length === 0) {
        console.log('No budgets to process');
        return {};
      }

      for (const budget of budgets) {
        try {
          console.log(`Processing budget: ${budget.category}`);

          const { data: transactions, error } = await supabase
            .from('transactions')
            .select('amount, txn_date, category')
            .eq('user_id', userId)
            .gte('txn_date', budget.start_date)
            .lte('txn_date', budget.end_date)
            .lt('amount', 0);

          if (error) {
            console.warn(
              `Error fetching transactions for budget ${budget.id}:`,
              error.message,
            );
            spentAmounts[budget.id] = 0;
            continue;
          }

          if (!transactions || !Array.isArray(transactions)) {
            console.log(`No transactions found for budget ${budget.category}`);
            spentAmounts[budget.id] = 0;
            continue;
          }

          console.log(`Found ${transactions.length} transactions`);

          // Demo: mock spending if no transactions
          if (transactions.length === 0) {
            const mockSpending = Math.random() * budget.amount * 0.8;
            spentAmounts[budget.id] = Number(mockSpending.toFixed(2));
            console.log(
              `Using mock spending: ${spentAmounts[budget.id]} for ${
                budget.category
              }`,
            );
            continue;
          }

          // Real calculation with safety checks
          const categoryTransactions = transactions.filter(txn => {
            try {
              const categoryData = txn?.category;

              if (!categoryData || typeof categoryData !== 'object') {
                return budget.category.toLowerCase().includes('other');
              }

              const transactionCategory = (categoryData.category || '')
                .toLowerCase()
                .trim();
              const budgetCategory = budget.category.toLowerCase().trim();

              const categoryMap = {
                food: ['grocery', 'eating', 'restaurant', 'food', 'bakery'],
                transport: ['fuel', 'gas', 'station', 'transport'],
                shopping: ['store', 'shop', 'clothing', 'department'],
                entertainment: ['theatre', 'movie', 'entertainment'],
                utilities: ['electric', 'utility', 'water', 'gas'],
                healthcare: ['hospital', 'medical', 'pharmacy', 'drug'],
                other: ['unknown', 'misc'],
              };

              for (const [key, keywords] of Object.entries(categoryMap)) {
                if (budgetCategory.includes(key)) {
                  return keywords.some(keyword =>
                    transactionCategory.includes(keyword),
                  );
                }
              }

              return (
                transactionCategory.includes(budgetCategory) ||
                budgetCategory.includes(transactionCategory)
              );
            } catch (err) {
              console.warn('Error processing transaction:', err);
              return false;
            }
          });

          const totalSpent = categoryTransactions.reduce((sum, txn) => {
            const amount = Math.abs(txn?.amount || 0);
            return sum + amount;
          }, 0);

          spentAmounts[budget.id] = Number(totalSpent.toFixed(2));
          console.log(
            `${budget.category}: ₹${spentAmounts[budget.id]} spent (${
              categoryTransactions.length
            } transactions)`,
          );
        } catch (budgetError) {
          console.error(
            `Error processing budget ${budget.category}:`,
            budgetError,
          );
          spentAmounts[budget.id] = 0;
        }
      }

      console.log('Final spent amounts:', spentAmounts);
      return spentAmounts;
    } catch (err) {
      console.error('Error in calculateBudgetSpending:', err);
      return rejectWithValue(err.message);
    }
  },
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
    clearError: state => {
      state.error = null;
    },
    updateSpentAmount: (state, action) => {
      const { budgetId, amount } = action.payload;
      state.spentAmounts[budgetId] = Number(amount.toFixed(2));
    },
  },
  extraReducers: builder => {
    builder
      // Fetch budgets
      .addCase(fetchBudgets.pending, state => {
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
      .addCase(createBudget.pending, state => {
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
      .addCase(updateBudget.pending, state => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.data.findIndex(
          budget => budget.id === action.payload.id,
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Delete budget
      .addCase(deleteBudget.pending, state => {
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
