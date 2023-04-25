import { FORM_VALIDATION_INVALID, FORM_VALIDATION_VALID } from "../utils/actionTypes";
import { FormValidationItemError } from "src/utils/constructors";

import type { Offcanvas } from "bootstrap";

export interface FormValidationState {
    isValid: boolean;
    [ name: `form-${string}` ]: FormValidationItemError | null;
}

interface Action<Type extends string, Payload> {
    type: Type;
    payload: Payload;
}

export type FormValidationAction = Action<typeof FORM_VALIDATION_INVALID | typeof FORM_VALIDATION_VALID, FormValidationActionPayload>;

interface FormValidationActionPayload {
    name: string;
    error: FormValidationItemError | null;
};

export interface BootstrapOptions {
    id?: string;
    selector?: string;
    callback?: (offcanvas: Offcanvas) => any;
}