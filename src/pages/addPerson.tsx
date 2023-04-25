import style from "@styles/addPerson/AddPerson.module.scss";

import Heading from "@components/addPerson/Heading";
import Persons from "@components/addPerson/Persons";
import GlobalLayout from "@components/global/GlobalLayout";

import type { NextPageWithLayout } from "src/types/global";

const AddPerson: NextPageWithLayout = () => {
    return(
        <div className={style.addPerson}>
            <Heading />
            <Persons />
        </div>
    )
}

AddPerson.getLayout = page => {
    return(
        <GlobalLayout>
            { page }
        </GlobalLayout>
    )
}

export default AddPerson;