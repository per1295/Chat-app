import style from "@styles/settings/ProfileData.module.scss";

import ProfileDataWrapper from "./ProfileDataWrapper";
import ProfileImg from "./ProfileImg";
import ProfileDataInput from "./ProfileDataInput";
import PurpleButton from "@components/global/PurpleButton";

import { useFormValidation, useLocalStorage } from "src/utils/hooks";
import { useTypedSelector, useTypedDispatch } from "src/utils/hooks";
import { patchUserData } from "src/redux/userData";

import type { FormEventHandler } from "react";

export default function ProfileData() {
    const { formState, formData, setFormData, onInput } = useFormValidation();
    const userData = useTypedSelector<"userData">(state => state.userData);
    const dispatch = useTypedDispatch();
    const storage = useLocalStorage();

    const onSubmit: FormEventHandler<HTMLFormElement> = async event => {
        event.preventDefault();

        const newUserData = { ...userData, ...formData };

        const thunkAction = await dispatch(
            patchUserData(newUserData)
        );
        
        if ( thunkAction.meta.requestStatus === "fulfilled" && thunkAction.meta.arg?.profileImage ) {
            storage?.setItem("user-data-profile-image", thunkAction.meta.arg.profileImage);
        }
    }

    return(
        <form className={`w-100 mw-100 row row-cols-1 row-cols-md-2 justify-content-center gy-3 ${style.settings_profileData}`} noValidate onSubmit={onSubmit}>
            <ProfileDataWrapper title="Profile image">
                <ProfileImg formData={formData} setFormData={setFormData} />
            </ProfileDataWrapper>
            <ProfileDataWrapper>
                <ProfileDataInput type="email" name="email" placeholder="New Email" formState={formState} formData={formData} onInput={onInput} />
                <ProfileDataInput type="text" name="password" placeholder="New password" formState={formState} formData={formData} onInput={onInput} />
                <ProfileDataInput type="text" name="username" placeholder="New username" formState={formState} formData={formData} onInput={onInput} />
                <PurpleButton className={`w-75 px-3 ${style.settings_profileData_btn}`} type="submit">
                    {
                        userData?.status === "pending" ? "Waiting..." : "Save changes"
                    }
                </PurpleButton>
            </ProfileDataWrapper>
        </form>
    )
}