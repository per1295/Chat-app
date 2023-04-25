import style from "@styles/home/CarouselItem.module.scss";

import Image from "next/image";

import dayflowBestFriends from "public/home/DayflowBestFriends.png";

export default function CarouselItem() {
    return(
        <div className={style.home_carousel_item}>
            <Image
                className={style.home_carousel_item_img}
                src={dayflowBestFriends}
                alt="Dayflow Best Friends"
                placeholder="blur"
                quality={100}
            />
        </div>
    )
}