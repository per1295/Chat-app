import type { Reducer } from "react";
import type { FormValidationState, FormValidationAction } from "src/types/hooks";

import { FORM_VALIDATION_INVALID, FORM_VALIDATION_VALID } from "./actionTypes";

export const formValidationReducer: Reducer<FormValidationState, FormValidationAction> = (state, action) => {
    state[`form-${action.payload.name}`] = action.payload.error;

    switch(action.type) {
        case FORM_VALIDATION_VALID:
            const someIsInvalid = Object
            .entries(state)
            .some(([key, value]) => (
                key !== "isValid" && value
            ));
            if ( !someIsInvalid ) state.isValid = true;
            break;
        case FORM_VALIDATION_INVALID:
            state.isValid = false;
            break;
    }

    return state;
};