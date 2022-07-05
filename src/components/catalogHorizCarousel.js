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
        spaceBetween: 15,
        direction: "horizontal",
        centeredSlides: false,
        preloadImages: true,
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
                slidesPerView: 5.08,
                slidesPerGroup: 5,
            }
        }
    }
  
    if(elementsData.length > 0 && typeof elementsData != "string")
    {
        return(
            <div id={"genreCarousel_" + carouselTitle} className="carousel__container">
                <div className="catalog--title">{carouselTitle}</div>
                <Swiper key={carouselTitle} {...swiperParams}>
                {
                    elementsData.map((element) =>
                    {
                        if(slideCounter < maxSlide)
                        {
                            incrementSlideCounter();
                            return(
                                <SwiperSlide key={"Slide_" + element.elementName}>
                                    <HorizontalCatalogCard cardsOnClickEvent={props.cardsOnClickEvent} elementData={element} carouselId={carouselTitle}></HorizontalCatalogCard>
                                </SwiperSlide>
                            )
                        }
                    })
                }
                </Swiper>
            </div>
        );
    }
    else
    {
        return(<></>);
    }
}

export default CatalogHorizCarousel;