import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURCE_PURSHASE_API="http://localhost:8080/api/v1/purchase/";

export const purchaseApi = createApi({
    reducerPath: "purchaseApi",
    baseQuery: fetchBaseQuery({ baseUrl: COURCE_PURSHASE_API, credentials: "include" }),

    endpoints:(builder)=>({
        createCheckoutSession: builder.mutation({
            query:(courceId)=>({
                url:"/checkout/create-checkout-session",
                method:"POST",
                body:{courceId}
            }),
        }),

        getCourceDetailsWithStatus: builder.query({
            query:(courceId)=>({
                url:`/cource/${courceId}/details-with-status`,
                method:"GET"
            }),
        }),

        getPurchasedCources: builder.query({
            query:()=>({
                url:"/",
                method:"GET"
            }),
        }),

    }),
});


export const {useCreateCheckoutSessionMutation, useGetCourceDetailsWithStatusQuery, useGetPurchasedCourcesQuery} = purchaseApi;
