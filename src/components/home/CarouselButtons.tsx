import type { Dispatch, FunctionComponent, SetStateAction } from "react"

import CarouselButtonsItem from "./CarouselButtonsItem";

interface CarouselButtonsProps {
    activeIndex: number;
    setActiveIndex: Dispatch<SetStateAction<number>>;
}

const CarouselButtons: FunctionComponent<CarouselButtonsProps> = ({ activeIndex, setActiveIndex }) => {
    return(
        <div className="d-flex gap-1">
            {
                Array.from({ length: 4 }).map((_i, index) => (
                    <CarouselButtonsItem key={index} index={index} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
                ))
            }
        </div>
    )
}

export default CarouselButtons;