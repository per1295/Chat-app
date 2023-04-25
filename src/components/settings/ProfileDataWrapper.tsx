import style from "@styles/settings/ProfileDataWrapper.module.scss";

import type { FunctionComponent } from "react";

interface ProfileDataWrapperProps {
    children: JSX.Element | null | (JSX.Element | null)[];
    title?: string;
    className?: string;
}

const ProfileDataWrapper: FunctionComponent<ProfileDataWrapperProps> = ({ children, title, className }) => {
    return(
        <div className={`col d-flex flex-column align-items-center justify-content-md-center ${className}`}>
            {
                title
                ?
                <span className={`text-center ${style.settings_profileData_text}`}>
                    {title}
                </span>
                :
                null
            }
            {children}
        </div>
    )
}

export default ProfileDataWrapper;