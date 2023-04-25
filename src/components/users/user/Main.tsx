import style from "@styles/users/user/Main.module.scss";

import type { FunctionComponent } from "react";
import type { UserData } from "src/types/user";

import ProfileDataWrapper from "@components/settings/ProfileDataWrapper";
import Image from "next/image";
import Icon from "@components/global/Icon";
import ProfileDataInput from "@components/settings/ProfileDataInput";

const Main: FunctionComponent<UserData> = ({ id, email, username, profileImage }) => {
    const wrapperClassName = `w-100 ${style.user_main_wrapper}`;

    return(
        <div className={`w-100 d-flex flex-column align-items-center flex-md-row justify-content-md-center gap-md-4 ${style.user_main}`} data-user-id={id}>
            <ProfileDataWrapper className={wrapperClassName} title="Profile image">
                {
                    profileImage
                    ?
                    <Image className={`rounded-circle ${style.user_main_image}`} src={profileImage} alt="profile_image" height={100} width={100} />
                    :
                    <Icon className={`bi-person-circle ${style.user_main_icon}`} />
                }
            </ProfileDataWrapper>
            <ProfileDataWrapper className={wrapperClassName}>
                <ProfileDataInput className="w-75" type="email" name="email" staticValue={email} isCannotBeChanged={true} />
                {
                    username
                    ?
                    <ProfileDataInput className="w-75" type="text" name="username" staticValue={username} isCannotBeChanged={true} />
                    :
                    null
                }
            </ProfileDataWrapper>
        </div>
    )
}

export default Main;