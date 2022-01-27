import React, { useState, useEffect } from "react";

function BackgroundImage(props)
{
    const [image, setImage] = useState();
    const [elementName, setElementName] = useState();

    const changeImage = () =>
    {
        console.log(props.dataImage);
        setImage(props.dataImage);
    }

    const changeName = () =>
    {
        setElementName("heroBg_" + props.elementName);
    }

    useEffect(()=>
    {
        changeImage();
        changeName();
    });

    return(
        <div className="siteBackImage">
            <img src={image} key={elementName} alt=""/>
        </div>
    );
}

export default BackgroundImage;