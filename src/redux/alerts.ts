import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

import type { Alerts, Alert } from "src/types/redux";
import type { PayloadAction } from "@reduxjs/toolkit";

const alertsSlice = createSlice({
    name: "alerts",
    initialState: [] as Alerts,
    reducers: {
        addAlert(state, action: PayloadAction<Omit<Alert, "id"> & Partial<Pick<Alert, "id">>>) {
            let { title, icon, id } = action.payload;
            
            if ( !id ) id = nanoid();

            state.push({ id, title, icon });
        },
        removeAlert(state, action: PayloadAction<string>) {
            return state.filter(alert => alert.id !== action.payload);
        }
    }
});

export default alertsSlice.reducer;
export const { addAlert, removeAlert } = alertsSlice.actions;