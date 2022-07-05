import React, { useState, useEffect } from "react";

function VerticalCatalogCard(props)
{
    const [dataElement, setDataElement] = useState();
    const [carouselId, setCarouselId] = useState();

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

    useEffect(()=>
    {
        changeDataElement();
        changeCarouselId();
    },[dataElement]);


    if(dataElement != null)
    {
        const { elementName, posterPath } = dataElement;

        var genresBlock = "";

        return(
            <div className="verticalCatalogCarousel--Card" id={"carouseCard_" + elementName} data-carouselid={"genreCarousel_" + carouselId} >
                <img src={posterPath} className="card--image" key={"element"} alt="elementCarousel"/>
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

export default VerticalCatalogCard;