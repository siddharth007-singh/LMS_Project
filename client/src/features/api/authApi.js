import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { userLogin, userLogout } from "../authSlice";

const USER_API = "http://localhost:8080/api/v1/user/";

export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({
        baseUrl:USER_API,
        credentials:'include'
    }),
    //we will use this builder to fetch or post the data 
    endpoints:(builder)=>({
        // we use builder.mutation to post the data
        registerUser:builder.mutation({
            query:(inputData)=>({
                url:"register",
                method:"POST",
                body:inputData
            })
        }),
        loginUser:builder.mutation({
            query:(inputData)=>({
                url:"login",
                method:"POST",
                body:inputData
            }),
            //After login we will set the user this fuxntion wll automatically run and we will set the user in the local storage
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLogin({user:result.data.user}));
                } catch (error) {
                    console.log(error);
                }
            }

        }),
        loadUser:builder.query({
            query:()=>({
                url:"profile",
                method:"GET"
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLogin({user:result.data.user}));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        updateUser:builder.mutation({
            query:(formData)=>({
                url:"update",
                method:"PUT",
                body:formData,
                credentials:'include',
            }),

        }),
        logoutUser:builder.mutation({
            query:()=>({
                url:"logout",
                method:"GET",
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLogout({user:result.data.user}));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
    })
});


export const {useRegisterUserMutation, useLoginUserMutation, useLoadUserQuery, useUpdateUserMutation, useLogoutUserMutation} = authApi;



///////////////// We have tw things to do here:
// 1. when we need to fetch the api we will use the builder.query function || in queryt we use {}
// 2. when we need to post the data we will use the builder.mutation function || in mutation we use []