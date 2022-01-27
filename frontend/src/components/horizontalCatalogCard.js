import React, { useState, useEffect } from "react";

function HorizontalCatalogCard(props)
{
    const [dataElement, setDataElement] = useState();
    const [carouselId, setCarouselId] = useState();

    const initTimeVideo = 45; // secondi
    const autoPlayVideoPreview = 4000; //millisecondi
    const autoStopVideoPreview = 20000; //millisecondi

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const changeDataElement = () =>
    {
        setDataElement(props.dataElement);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const changeCarouselId = () =>
    {
        setCarouselId(props.carouselId);
    }

    const getGenresArray = (data, maxGenres) =>
    {
        let genresArray = [];
        let genresCount = 0;

        for (const property in data)
        {
            if(genresCount < maxGenres)
            {
                genresArray.push(data[property].name);
                genresCount++;
            }
            else
            {
                break;
            }
        }

        return(genresArray);
    }

    var intervalVideo = "";
    var intervalPlayMedia = "";
    var intervalStopMedia = "";

    const setVideo = (event) =>
    {   
        let blockEvent = event.target;

        let card = blockEvent.querySelector(".card--media");

        let video = document.createElement('video');
        video.src = "http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_60fps_normal.mp4";
        video.currentTime = 0;
        video.muted = true; 

        card.appendChild(video);
        
        intervalPlayMedia = setTimeout(()=>
        {
            if (video.readyState === 4)
            {
                video.currentTime = initTimeVideo;
                video.style.opacity = 1;
                video.play();

                intervalStopMedia = setTimeout(()=>
                {
                    if (video.readyState === 4)
                    {
                        video.style.opacity = 0;
                        video.stop();
                    }
                }, autoStopVideoPreview);
            }
        }, autoPlayVideoPreview);
    }

    const removeVideo = (event) =>
    {
        clearTimeout(intervalVideo);
        clearTimeout(intervalPlayMedia);
        clearTimeout(intervalStopMedia);

        let blockEvent = event.target;

        let card = blockEvent.querySelector(".card--media");
        
        let video = "";

        video = card.querySelectorAll("video");

        video.forEach(element =>
        {
            element.style.opacity = 1;
            element.pause();
            element.remove();
        });
    }

    useEffect(()=>
    {
        changeDataElement();
        changeCarouselId();
    },[dataElement, carouselId, changeDataElement, changeCarouselId]);


    if(dataElement != null)
    {
        const { elementName, backgroundImage, logo, backdropImageWithLanguage } = dataElement;

        return(
            <div className="horizontalCatalogCarousel--Card" id={"carouseCard_" + elementName} data-carouselid={"genreCarousel_" + carouselId} onMouseEnter={(e) => setVideo(e)} onMouseLeave={(e) => removeVideo(e)}>
                <div className="card--media">
                    <img src={typeof backdropImageWithLanguage !== "undefined" ? backdropImageWithLanguage:backgroundImage} className="card--image" key={"element"} alt="elementCarousel"/>
                    <div className="card--logoDuration__Container">
                        <div className="card--logoDuration">
                            <div className="card--duration">
                                <span className="duration--total">
                                    <span className="duration--currentTime"></span>
                                </span>
                            </div>
                            <div className="card--logo">
                                <img src={logo} key={"element"} alt="elementCarouselLogo"/>
                            </div>
                        </div>
                    </div>
                    <div className="card--btns">
                        <div className="hearthPlus--btn">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 22">
                                <path d="M15.65,18.42C14.49,19.56,13.26,20.75,12,22,5.57,15.62,0,10.85,0,6.19A6,6,0,0,1,6.28,0,6.51,6.51,0,0,1,12,3.25,6.53,6.53,0,0,1,17.73,0,6,6,0,0,1,24,6.19a8,8,0,0,1-1.15,3.86L21.36,8.57A5.49,5.49,0,0,0,22,6.19,4.06,4.06,0,0,0,17.73,2c-3.26,0-5,3.47-5.73,5-.75-1.54-2.48-5-5.72-5A4.05,4.05,0,0,0,2,6.19c0,3.44,4.74,7.85,10,13L14.24,17ZM23,13H20V10H18v3H15v2h3v3h2V15h3Z"/>
                            </svg>
                        </div>
                        <div className="addList--btn">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 20">
                                <path d="M24,15H21V12H19v3H16v2h3v3h2V17h3ZM14,20H0V0H7c1.69,1.94,2.37,3,4,3H24v7H22V5H11C8.66,5,7.46,3.61,6.08,2H2V18H14Z"/>
                            </svg>
                        </div>
                        <div className="play--btn">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 24">
                                <path d="M2,3.53,16.11,12,2,20.47ZM0,0V24L20,12Z"/>
                            </svg>
                        </div>
                        <div className="mute--btn">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 24">
                                <path d="M18.45,0,15.22,4,8,8v2.29l3.84-2.14L6,15.35V8H1V18H3.84L0,22.73,1.55,24,20,1.27ZM4,16H3V10H4ZM17,7.36V23L8.25,18.14l1.28-1.58,5.47,3V9.82Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    else
    {
        return(
            <div className="catalogCarousel--Card">
            </div>
        );
    }
}

export default HorizontalCatalogCard;