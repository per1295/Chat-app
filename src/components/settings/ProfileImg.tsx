import style from "@styles/settings/ProfileImg.module.scss";

import Image from "next/image";
import Icon from "@components/global/Icon";

import { useTypedSelector } from "src/utils/hooks";
import { useEffect, useState } from "react";
import { BlobMaxSizes } from "src/utils/enums";

import type { FunctionComponent, Dispatch, SetStateAction } from "react";
import type { FormData } from "src/types/login";

interface ProfileImgProps {
    formData: FormData;
    setFormData: Dispatch<SetStateAction<FormData>>;
}

const ProfileImg: FunctionComponent<ProfileImgProps> = ({ formData, setFormData }) => {
    const userData = useTypedSelector<"userData">(state => state.userData);
    const [ profileImage , setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        if ( userData?.profileImage ) {
            setProfileImage(userData.profileImage);
        } else if ( formData?.profileImage ) {
            setProfileImage(formData.profileImage);
        }
    }, [ userData, formData ]);

    const onClick = () => {
        const fileControl = document.createElement("input");

        fileControl.type = "file";
        fileControl.name = "profileImage";

        fileControl.addEventListener("change", () => {
            const files = fileControl.files;

            if ( files ) {
                const lastFile = Array.from(files).at(-1);

                if ( lastFile && /image\/.+/.test(lastFile.type) && lastFile.size <= BlobMaxSizes.LONGBLOB ) {
                    const fileReader = new FileReader();

                    fileReader.readAsDataURL(lastFile);

                    fileReader.addEventListener("load", () => {
                        setFormData(formData => ({
                            ...formData,
                            [fileControl.name]: fileReader.result
                        }));
                    });
                }
            }
        });

        fileControl.click();
    }

    return profileImage ?
    (
        <Image
            className={`rounded-circle ${style.settings_profileImg_img}`}
            src={profileImage}
            alt="profile_image"
            height={100}
            width={100}
            onClick={onClick}
        />
    )
    :
    (
        <Icon className={`p-0 m-0 bi-person-circle ${style.settings_profileImg_icon}`} onClick={onClick} />
    )
}

export default ProfileImg;