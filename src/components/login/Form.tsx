import style from "@styles/login/Form.module.scss";

import FormItem from "./FormItem";
import PurpleButton from "@components/global/PurpleButton";

import { useRef } from "react";
import { useFormValidation, useTypedDispatch, useTypedSelector, useLocalStorage } from "src/utils/hooks";
import { postNewUser } from "src/redux/userData";
import { useRouter } from "next/router";
import { checkFields } from "src/globalUtils/functions";
import { addAlert } from "src/redux/alerts";

import type { FormEventHandler } from "react";

export default function Form() {
    const formRef = useRef<HTMLFormElement>(null);
    const { formState, formData, onInput } = useFormValidation();
    const dispatch = useTypedDispatch();
    const userData = useTypedSelector<"userData">((state => state.userData));
    const storage = useLocalStorage();
    const router = useRouter();

    const onSubmit: FormEventHandler = async event => {
        event.preventDefault();

        if ( formState.isValid ) {
            try {
                const thunkPayload = await dispatch( postNewUser(formData) ).unwrap();

                if ( thunkPayload && checkFields(thunkPayload, "id", "email", "password") ) {
                    if ( thunkPayload.profileImage ) {
                        storage?.setItem("user-data-profile-image", thunkPayload.profileImage);
                    }

                    dispatch(
                        addAlert({
                            title: `Wellcome ${thunkPayload.email}. Please wait.`,
                            icon: "info"
                        })
                    );

                    router.push("/chats");
                }
            } catch (error) {
                const e = error as Error;

                dispatch(
                    addAlert({
                        title: e.toString(),
                        icon: "error"
                    })
                )
            }
        }
    }

    return(
        <form
            ref={formRef}
            className={`align-self-center d-flex flex-column align-items-center ${style.login_form}`}
            noValidate
            onSubmit={onSubmit}
        >
            <div className={`w-100 row mb-5 ${style.login_form_container}`}>
                <FormItem
                    formState={formState}
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className="col-md-6"
                    onInput={onInput}
                />
                <FormItem
                    formState={formState}
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="col-md-6"
                    onInput={onInput}
                />
            </div>
            <PurpleButton
                className={style.login_form_button}
                type="submit"
                disabled={
                    userData?.status === "pending"
                    ?
                    true
                    :
                    false
                }
            >
                <span>
                    {
                        userData?.status === "pending" ? "Waiting..." : "Login"
                    }
                </span>
            </PurpleButton>
        </form>
    )
}