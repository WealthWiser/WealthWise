import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/client';
import { AxiosRequestConfig, AxiosError } from 'axios';

interface UserData {
    id: string;
    name: string;
    email: string;
    created_at: string | null;
    gender: string;
    country: string;
    dob: string | null;
}

interface UserState {
    loading: boolean;
    error: string | null;
    data: UserData;
}

interface ApiErrorResponse {
    message: string;
}

const initialState: UserState = {
    loading: false,
    error: null,
    data: {
        id: "",
        name: "",
        email: "",
        gender: "",
        country: "",
        dob: null,
        created_at: null,
    }
}



export const getUserData = createAsyncThunk<UserData, string, { rejectValue: string }>(
    'user/me',
    async (access_token, { rejectWithValue }) => {
        try {
            const config: AxiosRequestConfig = {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            };
            // 3. Return response.data, NOT the full response object
            const response = await api.get<UserData>("/user/me", config);
            return response.data;
        } catch (err) {
            // 4. Properly type the error
            const error = err as AxiosError<ApiErrorResponse>;
            if (!error.response) {
                throw err;
            }
            return rejectWithValue(error.response.data.message || 'Something went wrong');
        }
    }
);


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<Partial<UserData>>) => {
            Object.assign(state.data, action.payload);
        },
    },
    extraReducers:(builder)=>{
        builder
            .addCase(getUserData.pending, (state, action)=>{
                state.loading = true
                state.error= null
            })
            .addCase(getUserData.fulfilled, (state, action)=>{
                state.loading=false
                state.data = action.payload
            })
            .addCase(getUserData.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload || "Unknown error occurred";
                // console.log()
            })
    }
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
