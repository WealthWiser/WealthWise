import { createSlice } from '@reduxjs/toolkit';
import {Colors} from '../../utils/theme'
const initialState = {
    StatusBarcolorTop : Colors.neutralBackground,
    StatusBarcolorBot : Colors.neutralBackground,
    StatusBarTextStyle : 'dark-content',

};

export const statusBarColorSlice = createSlice({
    name: 'StatusBarColor',
    initialState,
    reducers: {
        changeStatusBarColorTop: (state, action) => {
            state.StatusBarcolorTop = (action.payload);
        },
        changeStatusBarColorBot: (state, action) => {
            state.StatusBarcolorBot = action.payload;
        },
        changeSStatusBarTextStyle: (state, action) => {
            state.StatusBarTextStyle = action.payload;
        },

    },
});

export const { changeStatusBarColorTop, changeStatusBarColorBot } = statusBarColorSlice.actions;
export default statusBarColorSlice.reducer;
