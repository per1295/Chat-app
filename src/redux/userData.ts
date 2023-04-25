import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { payloadCreatorWrapper } from "src/utils/functions";
import axios from "axios";

import type { UserData, ReduxState } from "src/types/redux";
import type { FormData } from "src/types/login";
import type { AddUserResponse, PatchUserDataResponse } from "src/types/responses";
import type { PayloadAction } from "@reduxjs/toolkit";

export const postNewUser = createAsyncThunk(
    "/login/addUser",
    payloadCreatorWrapper(
        async (formData: FormData, { signal }) => {
            const response = await axios.post<AddUserResponse>(
                "/login/addUser",
                formData,
                {
                    signal
                }
            );
    
            return response.data;
        }
    ),
    {
        condition(_formData, { getState }) {
            const { userData } = getState() as ReduxState;

            if ( userData?.status === "pending" ) return false;

            return true;
        }
    }
);

export const patchUserData = createAsyncThunk(
    "settings/changeUserData",
    payloadCreatorWrapper(
        async (arg: FormData, { signal }) => {
            const response = await axios.patch<PatchUserDataResponse>("settings/changeUserData", arg, {
                signal
            });

            return response.data;
        }
    )
);

const userDataSlice = createSlice({
    name: "userData",
    initialState: null as UserData,
    reducers: {
        resetUserData() {
            return null;
        },
        setUserData(state, action: PayloadAction<Partial<UserData>>) {
            if ( state && action.payload ) {
                for ( const [ key, value ] of Object.entries(action.payload) as [keyof NonNullable<UserData>, any][] ) {
                    if ( value ) state[key] = value;
                }
            } else {
                return action.payload as UserData;
            }
        }
    },
    extraReducers: builder => {
        builder
        .addCase(postNewUser.fulfilled, (_state, action) => {
            if ( action.payload ) {
                return {
                    ...action.payload,
                    status: "fulfilled"
                }
            }
        })
        .addCase(postNewUser.rejected, (_state, action) => {
            const rejectedUserData: UserData = {
                status: action.meta.requestStatus,
                id: "",
                email: "",
                password: ""
            };

            return rejectedUserData
        })
        .addCase(postNewUser.pending, (_state, action) => {
            const pendingUserData: UserData = {
                status: action.meta.requestStatus,
                id: "",
                email: "",
                password: ""
            };

            return pendingUserData;
        })
        .addCase(patchUserData.fulfilled, (state, action) => {
            if ( state && action.payload ) {
                state.status = "fulfilled";
                
                for ( const [ name, value ] of Object.entries(action.payload) as [keyof PatchUserDataResponse, any][] ) {
                    state[name] = value;
                }
            }
        })
        .addCase(patchUserData.pending, state => {
            if ( state ) state.status = "pending";
        })
    }
});

export const { resetUserData, setUserData } = userDataSlice.actions;
export default userDataSlice.reducer;