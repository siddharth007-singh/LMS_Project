import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:null,
    isAuth:false,
}

const authSlice = createSlice({
    name:"authSlice",
    initialState,

    reducers:{
        userLogin:(state,action)=>{
            state.user = action.payload.user;
            state.isAuth = true;
        },

        userLogout:(state)=>{
            state.user = null;
            state.isAuth = false;
        },
    }
});

export const {userLogin, userLogout} = authSlice.actions;
export default authSlice.reducer;

// 5:56:05