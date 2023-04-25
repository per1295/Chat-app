import style from "@styles/home/Button.module.scss";

import PurpleButton from "@components/global/PurpleButton";
import Link from "next/link";

export default function Button() {
    return(
        <PurpleButton className={`mt-5 ${style.home_button}`}>
           <Link href="/login" className="stretched-link text-decoration-none">
                Get Started
            </Link> 
        </PurpleButton>
    )
}