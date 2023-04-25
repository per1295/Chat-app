import { configureStore } from "@reduxjs/toolkit";

import type { ReduxState } from "src/types/redux";

import userData from "./userData";
import addUsersData from "./addUsersData";
import friendRequests from "./friendRequests";
import chatData from "./chatData";
import alerts from "./alerts";

const store = configureStore<ReduxState>({
    reducer: {
        userData,
        addUsersData,
        friendRequests,
        chatData,
        alerts
    }
});

export default store;