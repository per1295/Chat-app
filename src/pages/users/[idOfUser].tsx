import style from "@styles/users/user/User.module.scss";

import { getServerSidePropsWrapper } from "src/server/functions";
import { checkFields, normalizeBase64 } from "src/globalUtils/functions";

import type { UserProps, UserParams, UserDataServerVersion } from "src/types/user";
import type { UnitedWithErrorProps } from "src/types/functions";
import type { NextPageWithLayout } from "src/types/global";

import ErrorComponent from "@components/global/ErrorComponent";
import GlobalLayout from "@components/global/GlobalLayout";
import Heading from "@components/users/user/Heading";
import Main from "@components/users/user/Main";

export const getServerSideProps = getServerSidePropsWrapper<UserProps>(
    async ({ params, req }) => {
        const isLoginedUser = checkFields(req.cookies, "id", "email", "password");
        const { idOfUser } = params as UserParams;

        if ( isLoginedUser ) {
            const { connection } = globalThis;
            const { id, email, password } = req.cookies;

            const [ existUsers ] = await connection.execute(
                `
                    SELECT * FROM users
                    WHERE
                        id = :id AND email = :email AND password = :password
                    LIMIT 1
                `,
                { id, email, password }
            );

            if ( !existUsers.length ) throw new Error("User`s data isn`t correct.");

            const [ usersData ] = await connection.execute(
                `
                    SELECT
                        id,
                        email,
                        profileImage,
                        CASE
                            WHEN name IS NOT NULL AND surname IS NOT NULL
                            THEN CONCAT_WS(" ", name, surname)
                            ELSE NULL
                        END as username
                    FROM users
                    WHERE
                        id = :idOfUser
                    LIMIT 1
                `,
                { idOfUser }
            );

            if ( !usersData.length ) {
                throw new Error(`User with ${idOfUser} id does not exist.`);
            } else {
                const user = usersData[0] as UserDataServerVersion;

                if ( user.profileImage ) {
                    user.profileImage = normalizeBase64(user.profileImage.toString("base64"));
                }

                return {
                    props: { user }
                }
            }
        } else {
            throw new Error("You need to log in first of all.");
        }
    }
)

const User: NextPageWithLayout<UnitedWithErrorProps<UserProps>> =
({ user, errorName, errorMessage }) =>
{
    if ( errorName && errorMessage ) {
        return <ErrorComponent errorName={errorName} errorMessage={errorMessage} />
    } else {
        return(
            <div className={`d-flex flex-column align-items-center ${style.user}`}>
                <Heading />
                <Main {...user} />
            </div>
        )
    }
}

User.getLayout = (page) => {
    return(
        <GlobalLayout>
            {page}
        </GlobalLayout>
    )
}

export default User;