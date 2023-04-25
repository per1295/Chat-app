import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { payloadCreatorWrapper } from "src/utils/functions";
import { checkFields, getAxiosPathFromURL } from "src/globalUtils/functions";
import axios from "axios";

import type { AddUsersData, AddUsersDataUser, UserData, AddUsersDataArgument, FriendRequestArg, ReduxState } from "src/types/redux";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FriendRequestResponse } from "src/types/responses";

const BASE_PATH = "/addPerson";

export const getAddUsers = createAsyncThunk(
    BASE_PATH.concat("/getUsers"),
    payloadCreatorWrapper(
        async (userData: Partial<Pick<NonNullable<UserData>, "id" | "email" | "password"> & AddUsersDataArgument>, { signal }) => {
            const url = new URL(BASE_PATH.concat("/getUsers"), location.origin);

            for ( const [name, value] of Object.entries(userData) ) {
                if ( value ) url.searchParams.set(name, value);
            }

            const axiosPath = getAxiosPathFromURL(url);

            const response = await axios.get<AddUsersDataUser[]>(axiosPath, {
                signal
            });
            return response.data;
        }
    ),
    {
        condition: (arg, { getState }) => {
            const { addUsersData } = getState() as ReduxState;

            if ( addUsersData?.status === "pending" ) return false;
            
            return checkFields(arg, "id", "email", "password", "heading-input");
        },
    }
);

export const patchFriendRequest = createAsyncThunk(
    BASE_PATH.concat("/friendRequest"),
    payloadCreatorWrapper(
        async (arg: FriendRequestArg, { signal }) => {
            const url = new URL(BASE_PATH.concat("/friendRequest"), location.origin);
            const axiosPath = getAxiosPathFromURL(url);

            const response = await axios.put<FriendRequestResponse>(axiosPath, arg, { signal });

            return response.data;
        }
    ),
    {
        condition: (arg, { getState }) => {
            let result = true;

            const { addUsersData } = getState() as ReduxState;

            if ( addUsersData ) {
                result = !addUsersData.users.some(addUserData => arg.status === addUserData.status && arg.idOfResponser === addUserData.id);
            }

            return result;
        }
    }
)

const addUsersDataSlice = createSlice({
    name: "addUsersData",
    initialState: null as AddUsersData,
    reducers: {
        resetAddUsersData() {
            return null;
        },
        setUsersData(_state, action: PayloadAction<AddUsersData>) {
            return action.payload;
        }
    },
    extraReducers: builder => {
        builder
        .addCase(getAddUsers.fulfilled, (_state, action) => {
            if ( action.payload ) {
                const newAddUsersData: AddUsersData = {
                    status: action.meta.requestStatus,
                    users: action.payload
                };
    
                return newAddUsersData;
            }
        })
        .addCase(getAddUsers.rejected, (_state, action) => {
            const rejectedAddUsersData: AddUsersData = {
                status: action.meta.requestStatus,
                statusMessage: action.payload as string,
                users: []
            };

            return rejectedAddUsersData;
        })
        .addCase(getAddUsers.pending, (state, action) => {
            const pendingAddUsersData: AddUsersData = {
                status: action.meta.requestStatus,
                statusMessage: "Waiting...",
                users: state?.users ?? []
            }

            return pendingAddUsersData;
        })
        .addCase(patchFriendRequest.fulfilled, (state, action) => {
            if ( state && action.payload ) {
                const { idOfResponser, status } = action.payload;
                state.users = state.users.map(user => user.id === idOfResponser ? { ...user, status } : user);
            }
        })
        .addCase(patchFriendRequest.rejected, (state, action) => {
            if ( state ) {
                state.users = state.users.map(user => user.id === action.meta.arg.idOfResponser ? { ...user, status: "error" } : user);
            }
        })
        .addCase(patchFriendRequest.pending, (state, action) => {
            if ( state ) {
                state.users = state.users.map(user => user.id === action.meta.arg.idOfResponser ? { ...user, status: "waiting" } : user);
            }
        });
    }
});

export default addUsersDataSlice.reducer;
export const { resetAddUsersData, setUsersData } = addUsersDataSlice.actions;