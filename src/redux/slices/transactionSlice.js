import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabase'

// Async thunk to fetch transactions
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)

      if (error) {
        return rejectWithValue(error.message)
      }

      return data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default transactionsSlice.reducer
