import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { payloadCreatorWrapper } from "src/utils/functions";
import axios from "axios";

import type { FriendRequests } from "src/types/redux";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FriendRequestStatusResponse } from "src/types/responses";

export const patchFriendRequestStatus = createAsyncThunk(
    "/friends/patchFriendRequestStatus",
    payloadCreatorWrapper(
        async (arg: FriendRequestStatusResponse, { signal }) => {
            const response = await axios.patch<FriendRequestStatusResponse>("/friends/patchFriendRequestStatus", arg, {
                signal
            });

            return response.data;
        }
    )
)

const friendRequestsSlice = createSlice({
    name: "friendRequests",
    initialState: null as FriendRequests,
    reducers: {
        resetFriendRequests() {
            return null
        },
        setFriendRequests(state, action: PayloadAction<FriendRequests>) {
            if ( state && action.payload ) {
                for ( const [ name, value ] of Object.entries(action.payload) as [keyof NonNullable<FriendRequests>, any][] ) {
                    state[name] = value;
                }
            } else {
                return action.payload;
            }
        }
    },
    extraReducers: builder => {
        builder
        .addCase(patchFriendRequestStatus.fulfilled, (state, action) => {
            if ( state && action.payload ) {
                state.status = "fulfilled";

                const { idOfFriend, status } = action.payload;

                state.requests = state.requests.map(request => {
                    if ( request.idOfFriend === idOfFriend ) {
                        request.status = status;
                    }

                    return request;
                });
            }
        })
        .addCase(patchFriendRequestStatus.rejected, (state, action) => {
            if ( state ) {
                state.status = "rejected";
                state.statusMessage = action.payload as string;
            }
        })
        .addCase(patchFriendRequestStatus.pending, state => {
            if ( state ) state.status = "pending";
        });
    }
});

export default friendRequestsSlice.reducer;
export const { resetFriendRequests, setFriendRequests } = friendRequestsSlice.actions;