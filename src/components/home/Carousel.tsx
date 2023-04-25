import style from "@styles/home/Carousel.module.scss";

import type { FunctionComponent, Dispatch, SetStateAction, PointerEventHandler } from "react";
import type { CarouselDirection } from "src/types/home";

import { useState, useEffect, useRef } from "react";

import CarouselItem from "./CarouselItem";

interface CarouselProps {
    setActiveIndex: Dispatch<SetStateAction<number>>,
    activeIndex: number;
}

const Carousel: FunctionComponent<CarouselProps> =
({ setActiveIndex, activeIndex }) =>
{
    const [ isMove, setIsMove ] = useState(false);
    const [ direction, setDirection ] = useState<CarouselDirection>(null);
    const [ _moveValue, setMoveValue ] = useState(0);

    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let timeout = setTimeout(() => {
            setActiveIndex(prevActiveIndex => (
                prevActiveIndex === 3 ? 0 : prevActiveIndex + 1 
            ));
        }, 3000);

        return () => {
            clearTimeout(timeout);
        }
    }, [ activeIndex ]);

    useEffect(() => {
        if ( isMove && direction ) {
            switch(direction) {
                case "left":
                    setActiveIndex(index => {
                        const newIndex = index - 1;
                        return newIndex < 0 ? 0 : newIndex;
                    });
                    break;
                case "right":
                    setActiveIndex(index => {
                        const newIndex = index + 1;
                        return newIndex > 3 ? 3 : newIndex;
                    });
                    break;
            }
        }
    }, [ isMove, direction ]);

    useEffect(() => {
        const carousel = carouselRef.current as HTMLDivElement;
        const slides = Array.from(carousel.children) as HTMLDivElement[];
        const activeSlide = slides.at(activeIndex);

        if ( activeSlide ) {
            activeSlide.scrollIntoView({
                behavior: "smooth",
                inline: "center"
            })
        }
    }, [ activeIndex ]);

    const startMove: PointerEventHandler = event => {
        setIsMove(true);
        setMoveValue( Math.floor(event.clientX) );
    }

    const moving: PointerEventHandler = event => {
        if ( !isMove ) return;

        const { clientX } = event;

        setMoveValue(prevMoveValue => {
            if ( clientX > prevMoveValue && activeIndex !== 0 ) setDirection("left");
            else if ( clientX < prevMoveValue && activeIndex !== 3 ) setDirection("right");
            else setDirection(null);

            return Math.floor(clientX);
        });
    }

    const endMove: PointerEventHandler = () => {
        setIsMove(false);
    }

    return(
        <div
            ref={carouselRef}
            className={`d-flex gap-3 overflow-hidden position-relative ${style.home_carousel}`}
            onPointerDown={startMove}
            onPointerMove={moving}
            onPointerUp={endMove}
            onPointerCancel={endMove}
        >
            {
                Array.from({ length: 4 }).map((_i, index) => (
                    <CarouselItem key={index} />
                ))
            }
        </div>
    )
}

export default Carousel;