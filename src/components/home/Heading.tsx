import style from "@styles/home/Heading.module.scss";

export default function Heading() {
    return(
        <h1 className={`mt-5 mb-2 mt-md-0 mb-md-4 ${style.home_heading}`}>
            Get Closer To EveryOne
        </h1>
    )
}