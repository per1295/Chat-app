import { useReducer, useState, useEffect, useContext, useRef } from "react";

import { formValidationReducer } from "./reducers";
import { initFormValidationState } from "./initalStates";
import { checkFormItem } from "./functions";
import { FORM_VALIDATION_INVALID, FORM_VALIDATION_VALID } from "./actionTypes";
import { useSelector, useDispatch } from "react-redux";
import { BootstrapHookError } from "./constructors";
import { IsBootstrapReadyContext, ChatDataContext } from "./contexts";
import { getAxiosPathFromURL, objValuesTruthy } from "src/globalUtils/functions";
import store from "src/redux";
import axios from "axios";

import type { CheckFormItemOpt, AnyObject } from "src/types/functions";
import type { FormData } from "src/types/login";
import type { FormEventHandler } from "react";
import type { ReduxState, AsyncData } from "src/types/redux";
import type { BootstrapOptions } from "src/types/hooks";
import type { Tooltip, Offcanvas, Modal, Alert } from "bootstrap";
import type { Method, AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import type { ActionCreatorWithPayload, ActionCreator, AnyAction } from "@reduxjs/toolkit";

export function useFormValidation() {
    const [ formState, dispatch ] = useReducer(formValidationReducer, initFormValidationState);
    const [ formData, setFormData ] = useState<FormData>({});

    const onInput: FormEventHandler<HTMLInputElement | HTMLTextAreaElement> = event => {
        const control = event.currentTarget as HTMLInputElement;
        const floating = control.parentElement as HTMLDivElement;
        const { name, type, value } = control;

        // Check form`s validation
        const checkFormItemOpt: CheckFormItemOpt = {
            type,
            required: true,
            minLength: name.toLocaleLowerCase() === "password" ? 10 : 5,
            maxLength: 50
        };

        const error = checkFormItem(control, checkFormItemOpt);

        if ( error ) {
            dispatch({
                type: FORM_VALIDATION_INVALID,
                payload: { name, error }
            })
        } else {
            dispatch({
                type: FORM_VALIDATION_VALID,
                payload: { name, error }
            });
        }

        // Setting form`s data 
        setFormData(formData => ({ ...formData, [control.name]: control.value }));

        // Setting form`s bootstrap classes
        setTimeout(() => {
            if ( formState[`form-${name}`] ) {
                floating.classList.remove("is-valid");
                control.classList.remove("is-valid");
    
                floating.classList.add("is-invalid");
                control.classList.add("is-invalid");
            } else if ( value.length ) {
                floating.classList.remove("is-invalid");
                control.classList.remove("is-invalid");
    
                floating.classList.add("is-valid");
                control.classList.add("is-valid");
            }
        });
    }

    return { formState, formData, setFormData, onInput };
}

export function useTypedSelector<Key extends keyof ReduxState>(func: (key: ReduxState) => ReduxState[Key]) {
    return useSelector(func);
}

export function useTypedDispatch() {
    return useDispatch() as typeof store.dispatch;
}

export function useTooltip(opt: BootstrapOptions & Partial<Tooltip.Options>) {
    const isBootstrapReady = useContext(IsBootstrapReadyContext);
    const [ tooltip, setTooltip ] = useState<Tooltip | null>(null);

    useEffect(() => {
        let tooltip: Tooltip;
        let element: HTMLElement | null;

        if ( isBootstrapReady ) {
            const { bootstrap } = globalThis;

            if ( opt.id ) element = document.getElementById(opt.id);
            else if ( opt.selector ) element = document.querySelector(opt.selector);
            else throw new BootstrapHookError("Hook useTooltip was called without argument");

            if ( element ) {
                tooltip = new bootstrap.Tooltip(element, opt);
                setTooltip(tooltip);
            }
        }

        return () => {
            if ( tooltip ) tooltip.dispose();
        }
    }, [ isBootstrapReady ]);

    return tooltip;
}

export function useOffcanvas(opt: BootstrapOptions & Partial<Offcanvas.Options>) {
    const isBootstrapReady = useContext(IsBootstrapReadyContext);
    const [ offcanvas, setOffcanvas ] = useState<Offcanvas | null>(null);

    useEffect(() => {
        let offcanvas: Offcanvas;
        let element: HTMLElement | null;

        if ( isBootstrapReady ) {
            const { bootstrap } = globalThis;

            if ( opt.id ) element = document.getElementById(opt.id);
            else if ( opt.selector ) element = document.querySelector(opt.selector);
            else throw new BootstrapHookError("Hook useOffcanvas was called without argument");

            if ( element ) {
                offcanvas = new bootstrap.Offcanvas(element, opt);
                setOffcanvas(offcanvas);
                if ( opt.callback ) opt.callback(offcanvas);
            }
        }

        return () => {
            if ( offcanvas ) offcanvas.dispose();
        }
    }, [ isBootstrapReady ]);

    return offcanvas;
}

export function useLocalStorage() {
    const [ storage, setStorage ] = useState<Storage | null>(null);

    useEffect(() => {
        if ( !storage ) setStorage(localStorage);

        const formElements = document.querySelectorAll("input, textarea") as NodeListOf<HTMLInputElement | HTMLTextAreaElement>;
        formElements.forEach(formElement => {
            formElement.value = (!formElement.value ? localStorage.getItem(formElement.name) : formElement.value) as string;
        });
    }, []);

    return storage;
}

export function useAxios<ResponseType = AnyObject>
(url: string | URL, method: Extract<Lowercase<Method>, "get" | "post" | "put" | "patch" | "delete">, body?: AnyObject, config?: AxiosRequestConfig)
{
    const [ axiosData, setAxiosData ] = useState<AsyncData<ResponseType>>(null);

    const axiosFn = async function() {
        if ( url instanceof URL ) url = getAxiosPathFromURL(url);

        try {
            if ( body ) {
                const truthyBody = objValuesTruthy(body);

                if ( !Object.entries(truthyBody).length ) return;
            }

            setAxiosData(
                {
                    status: "pending"
                } as AsyncData<ResponseType>
            );

            let response: AxiosResponse<ResponseType>;

            if ( method === "get" ) {
                response = await axios.get(url, config);
            } else {
                response = await axios[method](url, body, config);
            }

            setAxiosData({
                ...response.data,
                status: "fulfilled"
            });
        } catch (error) {
            const e = error as AxiosError;

            setAxiosData(state => (
                state
                ?
                {
                    ...state,
                    status: "rejected",
                    statusMessage: e.response?.data as string
                }
                :
                state
            ));
        }
    }

    return { axiosData, axiosFn };
}

export function useReduxWithServerData<TypeOfArg>(thunk: ActionCreatorWithPayload<TypeOfArg>, arg: TypeOfArg, reset?: ActionCreator<AnyAction>) {
    const dispatch = useTypedDispatch();

    useEffect(() => {
        dispatch( thunk(arg) );

        return () => {
            if ( reset ) dispatch( reset() );
        }
    }, []);
}

export function useChatData() {
    const contextChatData = useContext(ChatDataContext);
    const reduxChatData = useTypedSelector<"chatData">(state => state.chatData);

    return reduxChatData ?? contextChatData;
}

export function useHideableOffcanvas(offcanvas: Offcanvas | null) {
    const [ isDown, setIsDown ] = useState(false);
    const lastScrollValueRef = useRef<number | null>(null);

    const handler = () => {
        const lastScrollValue = lastScrollValueRef.current;

        const { top } = document.body.getBoundingClientRect();
        
        if ( lastScrollValue === null || top < lastScrollValue ) {
            setIsDown(true);
        } else {
            setIsDown(false);
        }

        lastScrollValueRef.current = top;
    };

    useEffect(() => {
        window.addEventListener("scroll", handler);

        return () => {
            window.removeEventListener("scroll", handler);
        }
    }, []);

    useEffect(() => {
        if ( offcanvas && isDown ) {
            offcanvas.hide();
        } else if ( offcanvas ) {
            offcanvas.show();
        }
    }, [ isDown ]);
}

export function useModal(opt: BootstrapOptions & Partial<Modal.Options>) {
    const isBootstrapReady = useContext(IsBootstrapReadyContext);
    const [ modal, setModal ] = useState<Modal | null>(null);

    useEffect(() => {
        let modal: Modal;
        let element: HTMLElement | null;

        if ( isBootstrapReady ) {
            const { bootstrap } = globalThis;

            if ( opt.id ) element = document.getElementById(opt.id);
            else if ( opt.selector ) element = document.querySelector(opt.selector);
            else throw new BootstrapHookError("Hook useModal was called without argument");

            if ( element ) {
                modal = new bootstrap.Modal(element, opt);
                setModal(modal);
                if ( opt.callback ) opt.callback(modal);
            }
        }

        return () => {
            if ( modal ) modal.dispose();
        }
    }, [ isBootstrapReady ]);

    return modal;
}

export function useAlert(opt: BootstrapOptions) {
    const isBootstrapReady = useContext(IsBootstrapReadyContext);
    const [ alert, setAlert ] = useState<Alert | null>(null);

    useEffect(() => {
        let alert: Alert;
        let element: HTMLElement | null;

        if ( isBootstrapReady ) {
            const { bootstrap } = globalThis;

            if ( opt.id ) element = document.getElementById(opt.id);
            else if ( opt.selector ) element = document.querySelector(opt.selector);
            else throw new BootstrapHookError("Hook useAlert was called without argument");

            if ( element ) {
                alert = new bootstrap.Alert(element);
                setAlert(alert);
            }
        }

        return () => {
            if ( alert ) alert.dispose();
        }
    }, [ isBootstrapReady ]);

    return alert;
}