import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import SwiperCore,
{
    Autoplay
} from 'swiper';


function VerticalCarousel(props)
{
    SwiperCore.use([Autoplay]);

    const [elementsData, setElementsData] = useState([]);
    const [mySwiper, setMySwiper] = useState([]);

    var activeSlideIndex = 0;

    const changeElementData = () =>
    {
        setElementsData(props.elements);
    }

    function changeElementOnHero()
    {
        props.changeFirstElementData(elementsData[activeSlideIndex]);
    }

    function setFirstSlide(swiper)
    {
        swiper.slideTo(4);
    }

    function setSwiperCommand()
    {
        let carouselContainer = document.querySelector(".hero--carousel");
        let centerPlayHero = document.querySelector(".centerColumn--play");

        document.addEventListener("keydown", function(e)
        {
            if(e.keyCode === 40)
            {
                if(mySwiper.__swiper__ == true)
                {
                    mySwiper.slideNext();
                    mySwiper.autoplay.start();
                }
            }
            if(e.keyCode === 38)
            {
                if(mySwiper.__swiper__ == true)
                {
                    mySwiper.slidePrev();
                    mySwiper.autoplay.start();
                }
            }   
        });

        carouselContainer.addEventListener("mouseenter", function()
        {
            if(mySwiper.autoplay != null)
            {
                mySwiper.autoplay.stop();
            }
        });

        carouselContainer.addEventListener("mouseleave", function()
        {
            if(mySwiper.autoplay != null)
            {
                mySwiper.autoplay.start();
            }
        });

        centerPlayHero.addEventListener("mouseleave", function()
        {
            if(mySwiper.autoplay != null)
            {
                mySwiper.autoplay.start();
            }
        });

        centerPlayHero.addEventListener("mouseenter", function()
        {
            if(mySwiper.autoplay != null)
            {
                mySwiper.autoplay.stop();
            }
        });
    }

    useEffect(()=>
    {
        changeElementData();
        changeElementOnHero();
        setSwiperCommand();
    }, [elementsData]);

    const swiperParams =
    {
        spaceBetween: 30,
        direction: "vertical",
        centeredSlides: true,
        slidesPerView: 3.5,
        loop: true,
        autoplay:
        {
          delay: 8000,
        },
    }
  

    return(
        <Swiper {...swiperParams} id="heroCarousel" onSlideChange={(swiper) => {activeSlideIndex = swiper.realIndex; changeElementOnHero()}} onSwiper={(swiper) => { setFirstSlide(swiper); setMySwiper(swiper) }}>
            {
                elementsData.map((element) =>
                {
                    const { posterPath, elementName } = element;
                    let idSlide = "slide_" + elementName;
                    let idElement = "element_" + elementName;

                    return(
                        <SwiperSlide key={idSlide}>
                            <div id={idElement} className="carouselElement__container">
                                <img src={posterPath} alt="elementCarousel" />
                            </div>
                        </SwiperSlide>
                    )
                })
            }
        </Swiper>
    );
}

export default VerticalCarousel;