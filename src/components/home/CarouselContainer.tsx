import style from "@styles/home/CarouselContainer.module.scss";

import { useState } from "react";

import Carousel from "./Carousel";
import CarouselButtons from "./CarouselButtons";

export default function CarouselContainer() {
    const [ activeIndex, setActiveIndex ] = useState(0);

    return(
        <div className={`d-flex gap-3 flex-column align-items-center ${style.home_carouselContainer}`}>
            <Carousel activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
            <CarouselButtons activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        </div>
    )
}