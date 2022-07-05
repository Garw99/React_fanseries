import React, { useState, useEffect, useRef } from "react";
import { getFirestore, updateDoc, doc, getDoc, arrayUnion, arrayRemove, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from 'react-router-dom';
import axios from "axios";
import Skeleton from '@mui/material/Skeleton';
import Utilitys from '../classes/classUtilitys';
import ReactPlayer from 'react-player/lazy';

function HorizontalCatalogCard(props)
{
    const [elementData, setElementData] = useState();
    const [carouselId, setCarouselId] = useState();
    const [userData, setUserData] = useState();
    const [elementLastTime, setElementLastTime] = useState(40);
    const [lastEpisode, setLastEpisode] = useState(1);
    const [lastSeason, setLastSeason] = useState(1);
    const [videoSrc, setVideoSrc] = useState("");
    const [cardInHover, setCardInHover] = useState(false);

    const eventBlock = useRef();
    const muteBtn = useRef();
    const toWatchBtn = useRef();
    const favouriteBtn = useRef();

    let videoTimeOut;
    var videoWasPlayed = false;
    var favouriteStatus = false;
    var toWatchStatus = false;

    const sizeImages = "w500";
    const sizeLogoImages = "w300";
    const autoStopVideoPreview = 30000; //millisecondi
    
    const changeDataElement = () =>
    {
        setElementData(props.elementData);
    }

    const changeCarouselId = () =>
    {
        setCarouselId(props.carouselId);
    }

    const changeSizeImage = (url, size) =>
    {
        let newUrl = url.replace("original", size);

        return newUrl;
    }

    const toggleMute = () =>
    {
        let card = eventBlock.current;
        let video = card.querySelector("video");

        if(Utilitys.getCookie("videoPreviewMuted") === "true" ? true : false)
        {
            muteBtn.current.classList.remove("mute");
            video.muted = false;
            Utilitys.setCookie("videoPreviewMuted", false, 0); //Cookie name; Cookie value; Cookie expire days;
        }
        else
        {
            muteBtn.current.classList.add("mute");
            video.muted = true;
            Utilitys.setCookie("videoPreviewMuted", true, 0); //Cookie name; Cookie value; Cookie expire days;
        }
    }

    const getUserPreference = async (elementName) =>
    {
        const db = getFirestore();

        const docRef = doc(db, `Users/user_${userData.uid}/preference/moviePreference`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists())
        {
            if(docSnap.data().favourites != null)
            {
                if(docSnap.data().favourites.includes(elementName))
                {
                    if(favouriteBtn.current != null)
                    {
                        favouriteBtn.current.classList.add("active");
                    }
                }
            }

            if(docSnap.data().toWatch != null)
            {
                if(docSnap.data().toWatch.includes(elementName))
                {
                    if(toWatchBtn.current != null)
                    {
                        toWatchBtn.current.classList.add("active");
                    }
                }
            }
        }
    }

    const toggleFavouriteList = async (element) =>
    {
        const db = getFirestore();
 
        const docRef = doc(db, `Users/user_${userData.uid}/preference/moviePreference`);
        const docSnap = await getDoc(docRef);

        if(!favouriteStatus)
        {
            if (docSnap.exists())
            {
                await updateDoc(docRef,
                {
                    favourites: arrayUnion(element)
                });

                if(favouriteBtn.current != null)
                {
                    favouriteBtn.current.classList.add("active");
                }

                favouriteStatus = true;
            }
            else
            {
                await setDoc(docRef,
                {
                    favourites: arrayUnion(element)
                });

                if(favouriteBtn.current != null)
                {
                    favouriteBtn.current.classList.add("active");
                }

                favouriteStatus = true;
            }
        }
        else
        {
            if (docSnap.exists())
            {
                await updateDoc(docRef,
                {
                    favourites: arrayRemove(element)
                });

                if(favouriteBtn.current != null)
                {
                    favouriteBtn.current.classList.remove("active");
                }

                favouriteStatus = false;
            }
        }
    }

    const toggleToWatchList = async (element) =>
    {
        const db = getFirestore();
 
        const docRef = doc(db, `Users/user_${userData.uid}/preference/moviePreference`);
        const docSnap = await getDoc(docRef);

        if(!toWatchStatus)
        {
            if (docSnap.exists())
            {
                await updateDoc(docRef,
                {
                    toWatch: arrayUnion(element)
                });

                toWatchBtn.current.classList.add("active");
                toWatchStatus = true;
            }
            else
            {
                await setDoc(docRef,
                {
                    toWatch: arrayUnion(element)
                });

                toWatchBtn.current.classList.add("active");
                toWatchStatus = true;
            }
        }
        else
        {
            if (docSnap.exists())
            {
                await updateDoc(docRef,
                {
                    toWatch: arrayRemove(element)
                });

                toWatchBtn.current.classList.remove("active");
                toWatchStatus = false;
            }
        }
    }

    const removeVideo = () =>
    {
        setVideoSrc("");
        clearTimeout(videoTimeOut);
        setCardInHover(false);

        let page = eventBlock.current;
        let mediaContainer = page.querySelector(".card--media");
        mediaContainer.classList.remove("activeVideo");
    }

    const auth = getAuth();
    onAuthStateChanged(auth, (user) =>
    {
        if(user)
        {
            setUserData(auth.currentUser);
        }
    });

    const getLastTime = async (elementType, season, episode) =>
    {
        const db = getFirestore();
        let docRef;

        if(elementType.toLowerCase() === "series")
        {
            docRef = doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements/${elementData.elementName}/season_${season}/episode_${episode}`);
        }
        else
        {
            docRef = doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements/${elementData.elementName}`);
        }

        let docSnap = await getDoc(docRef);

        if (docSnap.exists())
        {
            setElementLastTime(docSnap.data().timeMinutes);
        }
    }

    const getLastEpisode = async (elementType) =>
    {
        const db = getFirestore();

        let docRef = doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements/${elementData.elementName}`);
        let docSnap = await getDoc(docRef);

        if (docSnap.exists())
        {
            setLastEpisode(docSnap.data().lastEpisode);
            setLastSeason(docSnap.data().lastSeason);
        }
    }

    useEffect(()=>
    {
        changeDataElement();
        changeCarouselId();

        let isApiSubscribed = true;

        if(Utilitys.getCookie("videoPreviewMuted") === "")
        {
            Utilitys.setCookie("videoPreviewMuted", false, 0); //Cookie name; Cookie value; Cookie expire days;
        }

        return () =>
        {
            isApiSubscribed = false;
        };

    },[elementData]);

    if(elementData != null && userData != null)
    {
        const { elementName, backgroundImage, elementLogo, elementType, videoPath} = elementData;

        let videoUrl = "";

        if(elementType === "Film")
        {
            getLastTime(elementType);
            videoUrl = `${videoPath}${elementType}/${elementName}.mp4`;
        }
        else
        {
            getLastEpisode(elementType);
            getLastTime(elementType, lastSeason, lastEpisode);

            videoUrl = `${videoPath}${elementType}/${elementName}/Season_${lastSeason}/${elementName}_S${lastSeason}_${lastEpisode}.mp4`;
        }

        getUserPreference(elementName);

        return(
            <div ref={eventBlock} className="horizontalCatalogCarousel--Card" id={"carouseCard_" + elementName} data-carouselid={"genreCarousel_" + carouselId} onMouseEnter={() => {setVideoSrc(videoUrl); setCardInHover(true);}} onMouseLeave={() => {removeVideo()}}>
                <Link to={elementName} className="horizontalCatalogCarousel--Link"></Link>
                <div className="card--media">
                    <ReactPlayer className="elementInfoPage-video" volume={Utilitys.getCookie("videoPreviewMuted") === "true" ? 0 : 1} url={videoSrc}
                        onStart={() =>
                        {
                            let page = eventBlock.current;
                            let mediaContainer = page.querySelector(".card--media");
                            let video = mediaContainer.querySelector("video");

                            video.currentTime = elementLastTime >= 40 ? elementLastTime : 0;
                        }}
                        onReady={() =>
                        {
                            if(cardInHover === true)
                            {
                                if(!videoWasPlayed && eventBlock.current != null && cardInHover !== false)
                                {
                                    let page = eventBlock.current;
                                    let mediaContainer = page.querySelector(".card--media");
                                    let video = mediaContainer.querySelector("video");

                                    mediaContainer.classList.add("activeVideo");
                                    
                                    if(video != null)
                                    {
                                        video.play();
                                    }

                                    videoTimeOut = setTimeout(() =>
                                    {
                                        videoWasPlayed = true;
                                        
                                        if(video != null)
                                        {
                                            video.pause();
                                        }

                                    }, autoStopVideoPreview); // 30 seconds   
                                }
                            }
                        }}
                        onPause = {() =>
                        {
                            let page = eventBlock.current;
                            let mediaContainer = page.querySelector(".card--media");
                            mediaContainer.classList.remove("activeVideo");
                        }}
                    />
                    <img src={backgroundImage} className="card--image" key={"element"} alt="elementCarousel"/>
                    <div className="card--logoDuration__Container">
                        <div className="card--logoDuration">
                            <div className="card--duration">
                                <span className="duration--total">
                                    <span className="duration--currentTime"></span>
                                </span>
                            </div>
                            <div className="card--logo">
                                <img src={elementLogo} key={"element"} alt="elementCarouselLogo"/>
                            </div>
                        </div>
                    </div>
                    <div className="card--btns">
                        <div ref={favouriteBtn} className="hearthPlus--btn" onClick={() => {toggleFavouriteList(elementName)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"/></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.653 19.415c-1.162 1.141-2.389 2.331-3.653 3.585-6.43-6.381-12-11.147-12-15.808 0-4.005 3.098-6.192 6.281-6.192 2.197 0 4.434 1.042 5.719 3.248 1.279-2.195 3.521-3.238 5.726-3.238 3.177 0 6.274 2.171 6.274 6.182 0 1.269-.424 2.546-1.154 3.861l-1.483-1.484c.403-.836.637-1.631.637-2.377 0-2.873-2.216-4.182-4.274-4.182-3.257 0-4.976 3.475-5.726 5.021-.747-1.54-2.484-5.03-5.72-5.031-2.315-.001-4.28 1.516-4.28 4.192 0 3.442 4.742 7.85 10 13l2.239-2.191 1.414 1.414zm7.347-5.415h-3v-3h-2v3h-3v2h3v3h2v-3h3v-2z"/></svg>
                        </div>
                        <div ref={toWatchBtn} className="addList--btn" onClick={() => {toggleToWatchList(elementName)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 22h-24v-14h7.262c1.559 0 2.411-.708 5.07-3h11.668v17zm-16.738-16c.64 0 1.11-.271 2.389-1.34l-2.651-2.66h-7v4h7.262z"/></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 17h-3v-3h-2v3h-3v2h3v3h2v-3h3v-2zm-10 5h-14v-20h7c1.695 1.942 2.371 3 4 3h13v7h-2v-5h-11c-2.34 0-3.537-1.388-4.916-3h-4.084v16h12v2z"/></svg>
                        </div>
                        <div className="play--btn">
                            <Link to={"/watch/" + elementName + `/${btoa(`type=${elementType}&season=${1}&episode=${1}`)}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 24"><path d="M2,3.53,16.11,12,2,20.47ZM0,0V24L20,12Z"/></svg>
                            </Link>
                        </div>
                        <div ref={muteBtn} className={`mute--btn ${(Utilitys.getCookie("videoPreviewMuted") === "true" ? true : false) === true ? "mute":""}`} onClick={() => {toggleMute()}}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 24"><path d="M18.45,0,15.22,4,8,8v2.29l3.84-2.14L6,15.35V8H1V18H3.84L0,22.73,1.55,24,20,1.27ZM4,16H3V10H4ZM17,7.36V23L8.25,18.14l1.28-1.58,5.47,3V9.82Z"/></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 9v6h-1v-6h1zm13-7l-9 5v2.288l7-3.889v13.202l-7-3.889v2.288l9 5v-20zm6.416 2.768l-4.332 2.5 1 1.732 4.332-2.5-1-1.732zm-17.416 2.232h-5v10h5v-10zm19 4h-5v2h5v-2zm-4.916 4l-1 1.732 4.332 2.5 1-1.732-4.332-2.5z"/></svg>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    else
    {
        return( 
            <div className="horizontalCatalogCarousel--Card">
                <Skeleton  variant="rectangular" sx={{backgroundColor:"#242424"}} className="skeleton-loading" />
            </div>
        );
    }
}

export default HorizontalCatalogCard;