import styles from "@styles/addPerson/Persons.module.scss";

import PersonsNone from "./PersonsNone";
import PersonsItem from "./PersonsItem";

import { useTypedSelector, useTypedDispatch, useLocalStorage } from "src/utils/hooks";
import { useEffect } from "react";
import { getAddUsers } from "src/redux/addUsersData";

export default function Persons() {
    const addUserData = useTypedSelector<"addUsersData">(state => state.addUsersData);
    const userData = useTypedSelector<"userData">(state => state.userData);
    const dispatch = useTypedDispatch();
    const storage = useLocalStorage();

    useEffect(() => {
        if ( !addUserData ) {
            dispatch(
                getAddUsers({
                    id: userData?.id,
                    email: userData?.email,
                    password: userData?.password,
                    "heading-input": storage?.getItem("heading-input") ?? undefined
                })
            );
        }
    }, [ userData, storage, addUserData ]);

    return(
        <div className={`d-flex flex-column align-items-center ${styles.addPerson_persons}`}>
            {
                addUserData?.users.length
                ?
                addUserData?.users.map(addUserData => (
                    <PersonsItem
                        key={addUserData?.id}
                        id={addUserData?.id}
                        username={addUserData?.username}
                        status={addUserData?.status}
                    />
                ))
                :
                <PersonsNone>
                    {
                        addUserData?.status === "pending"
                        ?
                        "Waiting..."
                        :
                        addUserData?.statusMessage as string
                    }
                </PersonsNone>
            }
        </div>
    )
}