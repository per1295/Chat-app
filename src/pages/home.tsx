import style from "@styles/home/Home.module.scss";

import Heading from "@components/home/Heading";
import SubHeading from "@components/home/SubHeading";
import CarouselContainer from "@components/home/CarouselContainer";
import Button from "@components/home/Button";

export default function Home() {
    return(
        <div className={`d-flex flex-column flex-md-row align-items-md-center justify-content-md-center gap-md-3 ${style.home}`}>
            <div className={`d-flex flex-column align-items-md-start ${style.wrapper1}`}>
                <Heading />
                <SubHeading />
            </div>
            <div className={`d-flex flex-column ${style.wrapper2}`}>
                <CarouselContainer />
                <Button />
            </div>
        </div>
    )
}