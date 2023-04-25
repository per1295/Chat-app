import style from "@styles/settings/ProfileDataInput.module.scss";

import type { FormEventHandler, FunctionComponent } from "react";
import type { UserData } from "src/types/redux";
import type { FormValidationState } from "src/types/hooks";
import type { FormData } from "src/types/login";

import { useTypedSelector } from "src/utils/hooks";
import { useId, useState, useEffect } from "react";

interface ProfileDataInput {
    type: "text" | "email" | "password";
    name: Exclude<keyof NonNullable<UserData>, "profileImage">;
    formState?: FormValidationState;
    formData?: FormData;
    placeholder?: string;
    onInput?: FormEventHandler;
    isCannotBeChanged?: boolean;
    staticValue?: string;
    className?: string;
}

const ProfileDataInput: FunctionComponent<ProfileDataInput> =
({ type, name, placeholder, formState, formData, onInput, isCannotBeChanged, staticValue, className }) =>
{
    const id = useId();
    const userData = useTypedSelector<"userData">(state => state.userData);
    const [ isPlainText, setIsPlainText ] = useState(true);

    useEffect(() => {
        if ( !isCannotBeChanged ) {
            if ( userData && userData[name] ) setIsPlainText(true);
            else setIsPlainText(false);
        }
    }, [ isCannotBeChanged, userData ]);
    
    const onClick = () => {
        setIsPlainText(false);
    }

    const onBlur = () => {
        if ( formData && formState ) {
            if ( ( userData && userData[name] ) || ( formData[name] && !formState[`form-${name}`] ) ) setIsPlainText(true);
            else setIsPlainText(false);
        }
    }

    return(
        <div className={`position-relative mb-4 text-center ${className}`}>
            <label htmlFor={id} className={`form-label text-capitalize ${style.settings_profileData_label}`}>{name}</label>
            <input
                type={type}
                readOnly={isPlainText}
                className={`${isPlainText || isCannotBeChanged ? "form-control-plaintext" : "form-control m-0 mt-2"} text-center text-truncate user-select-all ${style.settings_profileData_input}`}
                id={id}
                name={!isPlainText ? name : undefined}
                placeholder={!isPlainText ? placeholder : undefined}
                value={staticValue ?? ((formData ?? {})[name] ?? (userData ? userData[name] : ""))}
                autoComplete="off"
                aria-describedby={id}
                onClick={!isCannotBeChanged ? onClick : undefined}
                onBlur={!isCannotBeChanged ? onBlur : undefined}
                onInput={!isCannotBeChanged ? onInput : undefined}
                tabIndex={isCannotBeChanged ? -1 : undefined}
            />
            <span className="invalid-tooltip w-100">
                {formState ? formState[`form-${name}`]?.message : null}
            </span>
        </div>
    )
}

export default ProfileDataInput;