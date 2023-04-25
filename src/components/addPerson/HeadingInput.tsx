import style from "@styles/addPerson/HeadingInput.module.scss";

import { useLocalStorage } from "src/utils/hooks";
import { useTypedDispatch, useTypedSelector } from "src/utils/hooks";

import { getAddUsers } from "src/redux/addUsersData";

import type { FormEventHandler } from "react";

export default function HeadingInput() {
    const storage = useLocalStorage();
    const dispatch = useTypedDispatch();
    const userData = useTypedSelector<"userData">(state => state.userData);

    const onInput: FormEventHandler = async event => {
        const input = event.currentTarget as HTMLInputElement;

        if ( storage ) {
            storage.setItem(input.name, input.value);
        }

        dispatch(
            getAddUsers({
                id: userData?.id,
                email: userData?.email,
                password: userData?.password,
                "heading-input": input.value.toLowerCase()
            })
        );
    }

    return(
        <div className="form-floating flex-grow-1">
          <input
                type="text"
                className={`form-control ${style.addPerson_heading_input}`}
                name="heading-input"
                id="heading_input"
                placeholder="Nickname or email"
                onInput={onInput}
            />
          <label htmlFor="heading_input">Nickname or email</label>
        </div>
    )
}