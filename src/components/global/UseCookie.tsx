import { useEffect, useState } from "react";
import { checkCookies } from "src/utils/functions";
import { useTypedDispatch, useLocalStorage, useTypedSelector } from "src/utils/hooks";
import { setUserData } from "src/redux/userData";

import cookie from "cookiejs";

export default function UseCookie() {
    const userData = useTypedSelector<"userData">(state => state.userData);
    const dispatch = useTypedDispatch();
    const storage = useLocalStorage();
    const [ nowUserId, setNowUserId ] = useState<string | null>(null);

    useEffect(() => {
        if ( userData && userData.id && !nowUserId ) {
            setNowUserId(userData.id);
        }
    }, [ userData, nowUserId ]);

    useEffect(() => {
        if ( userData && userData.id !== nowUserId ) {
            // Clear previous user`s browsing data.
            cookie.clear("username");
            localStorage?.clear();

            setNowUserId(userData.id);
        }

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
    }, [ storage, userData, nowUserId ]);

    return null;
}