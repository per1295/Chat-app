import style from "@styles/login/FormItem.module.scss";

import { useId } from "react"

import type { FunctionComponent, FormEventHandler } from "react";
import type { FormValidationState } from "src/types/hooks";

interface FormItemProps {
    formState: FormValidationState;
    type: string;
    name: string;
    placeholder: string;
    className?: string;
    onInput?: FormEventHandler<HTMLInputElement>;
    onBlur?: FormEventHandler<HTMLInputElement>;
}

const FormItem: FunctionComponent<FormItemProps> =
({ formState, type, name, placeholder, className, onInput, onBlur }) =>
{
    const inputId = useId();

    return(
        <div className={`position-relative ${className}`}>
            <div className={`w-100 border border-2 border-secondary form-floating ${style.login_form_formItem}`}>
                <input
                    type={type}
                    className={`form-control ${style.login_form_formItem_input} ${style.login_form_formItem_text}`}
                    name={name}
                    id={inputId}
                    placeholder={placeholder}
                    autoComplete="off"
                    onInput={onInput}
                    onBlur={onBlur}
                />
                <label htmlFor={inputId} className={style.login_form_formItem_text}>{placeholder}</label>
            </div>
            <span className={`start-50 translate-middle-x text-center invalid-tooltip ${style.login_form_formItem_tooltip}`}>
                {formState[`form-${name}`]?.message}
            </span>
        </div>
    )
}

export default FormItem;