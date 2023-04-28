import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
    ChatData,
    PostUserMessageArg,
    PatchReadUserMessageArg,
    ReduxState,
    GetMessagesArg,
    ChatDataMessage
} from "src/types/redux";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { PostUserMessageResponse, PatchReadUserMessageResponse } from "src/types/responses";

import { payloadCreatorWrapper, getChatsPath, removeItemsWithId } from "src/utils/functions";
import { getAxiosPathFromURL } from "src/globalUtils/functions";
import axios from "axios";

export const getStatusOfUser = createAsyncThunk(
    "getStatusOfUser",
    payloadCreatorWrapper(
        async (_arg, { signal }) => {
            const axiosString = getChatsPath("getStatusOfUser");

            if ( axiosString ) {
                const response = await axios.get<NonNullable<ChatData>["statusOfUser"]>(axiosString, {
                    signal
                });

                return response.data
            }
        }
    ),
    {
        condition: (_arg, { getState }) => {
            const { chatData } = getState() as ReduxState;

            if ( chatData && chatData.status === "pending" ) {
                return false;
            }

            return true;
        }
    }
);

export const postMessages = createAsyncThunk(
    "messages/POST",
    payloadCreatorWrapper(
        async (arg: PostUserMessageArg, { signal }) => {
            const axiosString = getChatsPath("messages");

            if ( axiosString ) {
                const response = await axios.post<PostUserMessageResponse>(axiosString, arg, { signal });

                return response.data;
            }
        }
    ),
    {
        condition: (arg) => {
            const { content } = arg;

            return !!content.length;
        }
    }
);

export const patchReadUserMessage = createAsyncThunk(
    "readUserMessage",
    payloadCreatorWrapper(
        async (arg: PatchReadUserMessageArg, { signal }) => {
            const axiosString = getChatsPath("readUserMessage");

            if ( axiosString ) {
                const response = await axios.patch<PatchReadUserMessageResponse>(axiosString, { idOfMessage: arg.idOfMessage }, { signal });

                return response.data;
            }
        }
    ),
    {
        condition: (arg, { getState }) => {
            let result = true;

            const { userData, chatData } = getState() as ReduxState;

            if ( !userData || userData.id === arg.idOfSender ) result = false;
            if ( chatData?.messages.some(message => message.id === arg.idOfMessage && message.status === "read") ) result = false;
            
            return result;
        }
    }
);

export const getMessages = createAsyncThunk(
    "messages/GET",
    payloadCreatorWrapper(
        async (arg: GetMessagesArg, { signal }) => {
            let axiosString = getChatsPath("messages");
            
            if ( axiosString ) {
                const url = new URL(axiosString, location.origin);
                
                const { lastMessageId, latestMessageId } = arg;
                
                if ( lastMessageId ) {
                    url.searchParams.set("lastMessageId", lastMessageId);
                }

                if ( latestMessageId ) {
                    url.searchParams.set("latestMessageId", latestMessageId);
                }

                axiosString = getAxiosPathFromURL(url);

                const response = await axios.get<ChatDataMessage[]>(axiosString, { signal });

                return response.data;
            }
        }
    ),
    {
        condition: (_arg, { getState }) => {
            const { chatData } = getState() as ReduxState;
            
            if ( chatData && chatData.status === "pending" ) {
                return false;
            }

            return true;
        }
    }
)

const chatDataSlice = createSlice({
    name: "chatData",
    initialState: null as ChatData,
    reducers: {
        resetChatData() {
            return null
        },
        setChatData(state, action: PayloadAction<NonNullable<ChatData>>) {
            if ( state ) {
                for ( const [ key, value ] of Object.entries(action.payload) as [keyof NonNullable<ChatData>, never][] ) {
                    state[key] = value;
                }
            } else {
                return action.payload;
            }
        }
    },
    extraReducers: builder => {
        builder
        .addCase(getStatusOfUser.fulfilled, (state, action) => {
            if ( state && action.payload ) {
                state.statusOfUser = action.payload;
            }
        })
        .addCase(getStatusOfUser.rejected, state => {
            if ( state ) state.statusOfUser = "waiting";
        })
        .addCase(postMessages.fulfilled, (state, action) => {
            if ( state ) {
                state.status = "fulfilled";

                state.messages = state.messages.map(message => {
                    if ( action.payload && message.id === `placeholder-${action.meta.requestId}` ) {
                        return action.payload;
                    } else {
                        return message;
                    }
                });
            }
        })
        .addCase(postMessages.pending, (state, action) => {
            if ( state ) {
                let { content, type, idOfSender, idOfChat } = action.meta.arg;

                state.messages.push({
                    id: `placeholder-${action.meta.requestId}`,
                    content,
                    type,
                    birth: null,
                    status: "none",
                    idOfSender,
                    idOfChat
                });
            }
        })
        .addCase(postMessages.rejected, (state, action) => {
            if ( state ) {
                state.messages = state.messages.map(message => {
                    if ( message.id === `placeholder-${action.meta.requestId}` ) {
                        message.status = "error";
                    }

                    return message;
                });
            }
        })
        .addCase(patchReadUserMessage.fulfilled, (state, action) => {
            if ( state && action.payload ) {
                const { idOfMessage, status } = action.payload;

                state.messages = state.messages.map(message => {
                    if ( message.id === idOfMessage ) {
                        message.status = status;
                    }

                    return message;
                });
            }
        })
        .addCase(getMessages.fulfilled, (state, action) => {
            if ( state && action.payload ) {
                state.status = "fulfilled";
                
                const { lastMessageId, latestMessageId } = action.meta.arg;

                state.messages = state.messages.filter( removeItemsWithId(action.payload) );

                if ( lastMessageId ) {
                    if ( !action.payload.length ) state.isAllMessages = true;
                    state.messages = [ ...action.payload, ...state.messages ];
                } else if ( latestMessageId ) {
                    state.messages = [ ...state.messages, ...action.payload ];
                }
            }
        })
        .addCase(getMessages.rejected, state => {
            if ( state ) state.status = "fulfilled";
        })
        .addCase(getMessages.pending, (state, action) => {
            if ( state && action.meta.arg?.lastMessageId ) {
                state.status = "pending";
            }
        });
    }
});

export default chatDataSlice.reducer;
export const { resetChatData, setChatData } = chatDataSlice.actions;