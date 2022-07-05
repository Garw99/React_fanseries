import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from "swiper";
import 'swiper/css';


function VerticalCarouselCast(props)
{
    const [elementsData, setElementsData] = useState([]);
    const [mySwiper, setMySwiper] = useState([]);

    const changeElementData = () =>
    {
        setElementsData(props.elements);
    }

    function setSwiperCommand()
    {
        document.addEventListener("keydown", function(e)
        {
            if(e.keyCode === 40)
            {
                if(mySwiper.__swiper__ == true)
                {
                    mySwiper.slideNext();
                }
            }
            if(e.keyCode === 38)
            {
                if(mySwiper.__swiper__ == true)
                {
                    mySwiper.slidePrev();
                }
            }   
        });
    }

    useEffect(()=>
    {
        changeElementData();
        setSwiperCommand();
    }, [elementsData]);

    const swiperParams =
    {
        spaceBetween: 30,
        direction: "vertical",
        centeredSlides: true,
        initialSlide: 0,
        slidesPerView: 3.1,
        centeredSlides: false,
    }

    if(elementsData != null)
    {
        return(
            <Swiper className="elementInfoPage__castContainer" mousewheel={true} modules={[Mousewheel]} {...swiperParams} key={"castCarousel"} id="heroCarousel" onSwiper={(swiper) => { setMySwiper(swiper) }}>
                {
                    elementsData.map((element) =>
                    {
                        const { originalName, character, image } = element;

                        const imageUrl = "https://www.themoviedb.org/t/p/original" + image;
    
                        if(image != null)
                        {
                            return(
                                <SwiperSlide key={"slideCast_" + originalName.replaceAll(/[^a-zA-Z ]/g, "")}>
                                    <div className="castActor-block">
                                        <img src={imageUrl} alt="castActorImage" />
                                        <div className="castActor-Info">
                                            <h3>{character}</h3>
                                            <h4>{originalName}</h4>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        }
                    })
                }
            </Swiper>
        );
    }
    else
    {
        return(<></>);
    }
}

export default VerticalCarouselCast;