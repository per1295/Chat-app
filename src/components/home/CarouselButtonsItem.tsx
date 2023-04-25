import style from "@styles/home/CarouselButtonsItem.module.scss";

import type { FunctionComponent, Dispatch, SetStateAction } from "react";

interface CarouselButtonsItemProps {
    index: number;
    activeIndex: number;
    setActiveIndex: Dispatch<SetStateAction<number>>;
}

const CarouselButtonsItem: FunctionComponent<CarouselButtonsItemProps> =
({ index, activeIndex, setActiveIndex }) =>
{
    const bgClassName =
    index === activeIndex
    ?
    `rounded-pill ${style.home_carousel_butons_item} ${style.home_carousel_butons_item_active}`
    :
    `rounded-circle ${style.home_carousel_butons_item}`;

    return(
        <button className={bgClassName} onClick={() => setActiveIndex(index)}></button>
    )
}

export default CarouselButtonsItem;