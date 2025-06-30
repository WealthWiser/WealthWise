import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: '',
    riskProfile: 'medium',
    income: 0,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
