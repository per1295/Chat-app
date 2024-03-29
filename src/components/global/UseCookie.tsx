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
        if ( userData ) {
            if ( userData.id ) {
                setNowUserId(userData.id);
            }
    
            if ( nowUserId && userData.id !== nowUserId ) {
                // Clear previous user`s browsing data.
                cookie.clear("username");
                localStorage?.clear();
            }
        }
    }, [ userData, nowUserId ]);

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