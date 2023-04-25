import style from "@styles/global/HeadingBack.module.scss";

import Image from "next/image";

import { useRouter } from "next/router";

import arrowLeft from "public/login/ArrowLeft.png";

import type { FunctionComponent } from "react";

interface HeadingBackProps {
    className?: string;
}

const HeadingBack: FunctionComponent<HeadingBackProps> = ({ className }) => {
    const router = useRouter();

    const back = () => router.back();

    return(
        <button
            className={`position-relative d-flex align-items-center justify-content-center border border-2 border-dark rounded-circle bg-transparent ${style.login_heading_back} ${className}`}
            onClick={back}
        >
            <Image src={arrowLeft} alt="arrowLeft" quality={100} priority />
        </button>
    )
}

export default HeadingBack;