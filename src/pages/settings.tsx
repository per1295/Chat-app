import style from "@styles/settings/Settings.module.scss";

import type { NextPageWithLayout } from "src/types/global";

import GlobalLayout from "@components/global/GlobalLayout";
import Heading from "@components/settings/Heading";
import ProfileData from "@components/settings/ProfileData";

const Settings: NextPageWithLayout = () => {
    return(
        <div className={`d-flex flex-column align-items-center ${style.settings}`}>
            <Heading />
            <ProfileData />
        </div>
    )
}

Settings.getLayout = page => {
    return(
        <GlobalLayout>
            { page }
        </GlobalLayout>
    )
}

export default Settings;