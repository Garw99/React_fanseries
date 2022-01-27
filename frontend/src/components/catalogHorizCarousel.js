import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import HorizontalCatalogCard from "../components/horizontalCatalogCard";
import 'swiper/css';

import SwiperCore,
{
    Autoplay
} from 'swiper';


function CatalogHorizCarousel(props)
{
    SwiperCore.use([Autoplay]);

    const [elementsData, setElementsData] = useState([]);
    const [carouselTitle, setCarouselTitle] = useState([]);
    const [maxSlide, setmaxSlide] = useState([]);
    const [mySwiper, setMySwiper] = useState([]);

    var slideCounter = 0;

    const incrementSlideCounter = () =>
    {
        slideCounter++;
    }

    const changeElementData = () =>
    {
        setElementsData(props.elements);
    }

    const changeCarouselTitle = () =>
    {
        setCarouselTitle(props.title);
    }

    const changeMaxSlide = () =>
    {
        setmaxSlide(props.slide);
    }

    useEffect(()=>
    {
        changeElementData();
        changeCarouselTitle();
        changeMaxSlide();
    }, [elementsData]);

    const swiperParams =
    {
        spaceBetween: 20,
        direction: "horizontal",
        centeredSlides: false,
        preloadImages: true,
        slidesPerView: 4.2,
        slidesPerGroup: 4,
        breakpoints:
        {
            // when window width is >= 320px
            320: {
                slidesPerView: 2.2,
                slidesPerGroup: 2,
            },
            // when window width is >= 480px
            480: {
                slidesPerView: 3.3,
                slidesPerGroup: 3,
            },
            // when window width is >= 640px
            640: {
                slidesPerView: 4.6,
                slidesPerGroup: 4,
            }
        }
    }
  
    return(
        <div id={"genreCarousel_" + carouselTitle} className="carousel__container">
            <div className="catalog--title">{carouselTitle}</div>
            <Swiper key={carouselTitle} {...swiperParams} /* onSwiper={(swiper) => { setMySwiper(swiper) }} */>
            {
                // eslint-disable-next-line array-callback-return
                elementsData.map((element) =>
                {
                    const { elementName } = element;
                    let idSlide = carouselTitle + "_slide_" + elementName;
                    let idElement = carouselTitle + "_element_" + elementName;

                    if(slideCounter < maxSlide)
                    {
                        incrementSlideCounter();
                        return(
                            <>
                                <SwiperSlide key={idSlide}>
                                    <HorizontalCatalogCard key={idElement} dataElement={element} carouselId={carouselTitle}></HorizontalCatalogCard>
                                </SwiperSlide>
                            </>
                        )
                    }
                })
            }
            </Swiper>
        </div>
    );
}

export default CatalogHorizCarousel;