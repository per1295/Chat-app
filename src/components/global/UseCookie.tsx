import { useEffect } from "react";
import { checkCookies } from "src/utils/functions";
import { useTypedDispatch, useLocalStorage } from "src/utils/hooks";
import { setUserData } from "src/redux/userData";

import cookie from "cookiejs";

export default function UseCookie() {
    const dispatch = useTypedDispatch();
    const storage = useLocalStorage();

    useEffect(() => {
        if ( checkCookies("id", "email", "password") ) {
            const allCookies = cookie.all();
            const profileImage = storage?.getItem("user-data-profile-image") ?? undefined;

            dispatch(
                setUserData({
                    status: "fulfilled",
                    id: allCookies.id,
                    email: allCookies.email,
                    password: allCookies.password,
                    username: allCookies?.username,
                    profileImage
                })
            );
        }
    }, [ storage ]);

    return null;
}