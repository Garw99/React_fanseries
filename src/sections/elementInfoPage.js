import { getFirestore, updateDoc, doc, getDoc, arrayUnion, arrayRemove, setDoc } from "firebase/firestore";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import VerticalCarouselCast from "../components/verticalCarouselCast";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect, useRef } from "react";
import EpisodesList from '../components/episodesList';
import 'react-circular-progressbar/dist/styles.css';
import Utilitys from '../classes/classUtilitys';
import { useParams } from "react-router-dom";
import ReactPlayer from 'react-player/lazy';
import { Link } from 'react-router-dom';
import axios from "axios";

function ElementInfoPage(props)
{
    const [element, setElement] = useState();
    const [elementData, setElementData] = useState([]);
    const [elementLastTime, setElementLastTime] = useState(false);
    const [elementTimeLenght, setElementTimeLenght] = useState(false);
    const [lastEpisode, setLastEpisode] = useState(1);
    const [lastSeason, setLastSeason] = useState(1);
    const [userData, setUserData] = useState();
    const [mutedClass, setMutedClass] = useState((Utilitys.getCookie("videoPreviewMuted") === "true" ? "mute" : "") ? "mute":"");

    if(Utilitys.getCookie("videoPreviewMuted") === "")
    {
        Utilitys.setCookie("videoPreviewMuted", false, 0); //Cookie name; Cookie value; Cookie expire days;
    }

    let { elementId } = useParams();

    const pageInfo = useRef();

    const toWatchBtn = useRef();
    const favouriteBtn = useRef();
    const likedBtn = useRef();
    const unLikedBtn = useRef();
    const muteBtn = useRef();

    let videoWasPlayed = false;
    let setEventOnContainer = false;

    let favouriteStatus = false;
    let toWatchStatus = false;

    let mutedVideo = false;
    mutedVideo = Utilitys.getCookie("videoPreviewMuted") === "true" ? true : false;

    const circularRateStyle =
    {
        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
        strokeLinecap: 'butt',
    
        // Colors
        pathColor: `#fff`,
        textColor: '#fff',
        trailColor: '#707070',
        backgroundColor: 'rgba(23,23,23, 0.6)',
    }

    const formatTime = (sec) =>
    {
        let hours   = Math.floor(sec / 3600);
        let minutes = Math.floor((sec - (hours * 3600)) / 60);
        let seconds = sec - (hours * 3600) - (minutes * 60);

        if (hours < 10) {hours = "0" + hours;}
        if (minutes < 10) {minutes = "0" + minutes;}
        if (seconds < 10) {seconds = "0" + Math.trunc(seconds);} else {seconds = Math.trunc(seconds);}

        if(hours === "00")
        {
            return minutes + ':' + seconds;
        }
        else
        {
            return hours + ':' + minutes + ':' + seconds;
        }
    }

    const getElementData = async () =>
    {
        if(element !== "" && typeof element !== "undefined")
        {
            try
            {
                const response = await axios.post('/api/getElementInfo', { params:{ elementName: element } });
                setElementData(response);
            }
            catch (error)
            {
                console.log(error);
            }
        }
    }

    const setSizeBgImages = () =>
    {
        if(typeof pageInfo.current !== "undefined" && pageInfo.current != null)
        {
            let images = pageInfo.current.querySelectorAll(".elementInfoPage-bgImages");

            images.forEach(element =>
            {
                element.style.width = pageInfo.current.getBoundingClientRect().width + "px";
            });

            if(setEventOnContainer === false)
            {
                setEventOnContainer = true;
                window.addEventListener("resize", () =>
                {
                    images.forEach((element) =>
                    {
                        if(typeof pageInfo.current !== "undefined" && pageInfo.current != null)
                        {
                            element.style.width = pageInfo.current.getBoundingClientRect().width + "px";
                        }
                    });
                });
            }
        }
    }

    const toggleMute = () =>
    {
        let page = pageInfo.current;
        let video = page.querySelector("video");
            
        if(mutedVideo)
        {
            video.muted = false;
            mutedVideo = false;

            setMutedClass("");
            Utilitys.setCookie("videoPreviewMuted", false, 0); //Cookie name; Cookie value; Cookie expire days;
        }
        else
        {
            
            video.muted = true;
            mutedVideo = true;

            setMutedClass("mute");
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
                    favouriteStatus = true;
                    favouriteBtn.current.classList.add("active");
                }
            }

            if(docSnap.data().toWatch != null)
            {
                if(docSnap.data().toWatch.includes(elementName))
                {
                    toWatchStatus = true;
                    toWatchBtn.current.classList.add("active");
                }
            }

            if(docSnap.data().liked != null)
            {
                if(docSnap.data().liked.includes(elementName))
                {
                    likedBtn.current.classList.add("active");
                }
            }

            if(docSnap.data().unliked != null)
            {
                if(docSnap.data().unliked.includes(elementName))
                {
                    unLikedBtn.current.classList.add("active");
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

                favouriteBtn.current.classList.add("active");
                favouriteStatus = true;
            }
            else
            {
                await setDoc(docRef,
                {
                    favourites: arrayUnion(element)
                });

                favouriteBtn.current.classList.add("active");
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

                favouriteBtn.current.classList.remove("active");
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

    const setLike = async () =>
    {
        const db = getFirestore();
 
        const docRef = doc(db, `Users/user_${userData.uid}/preference/moviePreference`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists())
        {
            await updateDoc(docRef,
            {
                liked: arrayUnion(element),
                unliked: arrayRemove(element)
            });

            likedBtn.current.classList.add("active");
            unLikedBtn.current.classList.remove("active");
        }
        else
        {
            await setDoc(docRef,
            {
                liked: arrayUnion(element),
                unliked: arrayRemove(element)
            });

            likedBtn.current.classList.add("active");
            unLikedBtn.current.classList.remove("active"); 
        }
    }

    const setUnLike = async () =>
    {
        const db = getFirestore();
 
        const docRef = doc(db, `Users/user_${userData.uid}/preference/moviePreference`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists())
        {
            await updateDoc(docRef,
            {
                unliked: arrayUnion(element),
                liked: arrayRemove(element)
            });

            unLikedBtn.current.classList.add("active");
            likedBtn.current.classList.remove("active");
        }
        else
        {
            await setDoc(docRef,
            {
                unliked: arrayUnion(element),
                liked: arrayRemove(element)
            });

            unLikedBtn.current.classList.add("active");
            likedBtn.current.classList.remove("active");
        }
    }

    const getLastTime = async (elementType, season, episode) =>
    {
        const db = getFirestore();
        let docRef;

        if(elementType.toLowerCase() === "series")
        {
            docRef = doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements/${elementId}/season_${season}/episode_${episode}`);
        }
        else
        {
            docRef = doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements/${elementId}`);
        }

        let docSnap = await getDoc(docRef);

        if (docSnap.exists())
        {
            setElementLastTime(docSnap.data().timeMinutes);
            setElementTimeLenght(docSnap.data().totalTime);
        }
    }

    const getLastEpisode = async (elementType) =>
    {
        const db = getFirestore();

        let docRef = doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements/${elementId}`);
        let docSnap = await getDoc(docRef);

        if (docSnap.exists())
        {
            setLastEpisode(docSnap.data().lastEpisode);
            setLastSeason(docSnap.data().lastSeason);
        }
    }

    const auth = getAuth();
    onAuthStateChanged(auth, (user) =>
    {
        if(user)
        {
            setUserData(auth.currentUser);
        }
    });

    useEffect(()=>
    {
        setElement(elementId);
        setSizeBgImages();
    });

    useEffect(()=>
    {
        getElementData();
    },[element]);

    if(elementData.status === 200 && userData != null)
    {
        let loader = document.querySelector(".loader")
        if(loader != null)
        {
            loader.classList.remove("loader--visible")
        }

        const { backdropImageWithLanguage, logo, plot, cast, voteAverage, releaseDate, elementDuration, genres, networks, studios, elementType, elementName, videoPath } = elementData.data;

        let maxGenres = 3;
        let genresCount = 0;

        let production = "";

        if(networks != null && networks.length > 0)
        {
            production = networks[0].Image;
        }
        else if(studios != null && studios.length > 0)
        {
            production = studios[0].Image;
        }

        let videoSrc = "";

        if(elementType === "Film")
        {
            videoSrc = `${videoPath}${elementType}/${elementName}.mp4`;
        }
        else
        {
            videoSrc = `${videoPath}${elementType}/${elementName}/Season_${lastSeason}/${elementName}_S${lastSeason}_${lastEpisode}.mp4`;
        }

        const getProductionBlock = () =>
        {
            if(production != null && production !== "")
            {
                return(
                    <div className="generalInfo-info">
                        <h4>Produzione</h4>
                        <div className="generalInfo__image">
                            <img src={"https://www.themoviedb.org/t/p/original" + production} alt="logo" />
                        </div>
                    </div>
                );
            }
        }

        if(elementType === "Film")
        {
            getLastTime(elementType);
        }
        else
        {
            getLastEpisode(elementType);
            getLastTime(elementType, lastSeason, lastEpisode);
        }

        const seasonEpisodeString = elementType.toLowerCase() === "series" ? ` S${lastSeason}E${lastEpisode}` : "";

        getUserPreference(elementName);

        return(
            <div ref={pageInfo} className="elementInfoPage-container" key={"infoPageFor_" + element}>
                <div className="elementInfoPage-content">
                    <ReactPlayer className="elementInfoPage-video" volume={mutedVideo === true ? 0 : 1} url={videoSrc}
                        onStart={() =>
                        {
                            let page = pageInfo.current;
                            let video = page.querySelector("video");

                            video.currentTime = elementLastTime !== false ? elementLastTime : 0;
                        }}
                        onReady={() =>
                        {
                            let videoInterval = null;
                            
                            setTimeout(() =>
                            {
                                videoInterval = setInterval(() =>
                                {
                                    if(!videoWasPlayed && pageInfo.current != null)
                                    {
                                        let page = pageInfo.current;
                                        let video = page.querySelector("video");

                                        page.classList.add("activeVideo");
                                        video.play();

                                        setTimeout(() =>
                                        {
                                            videoWasPlayed = true;
                                            video.pause();
                                        }, 50000); // 50 seconds   

                                        clearInterval(videoInterval);
                                    }
                                },1000);
                            }, 5000);
                        }}
                        onPause = {() =>
                        {
                            let page = pageInfo.current;
                            page.classList.remove("activeVideo");
                        }}
                    />
                    <div className="elementInfoPage-cast">
                        <img className="elementInfoPage-bgImages" src={backdropImageWithLanguage} key={"element"} alt="bgInfoElementPage"/>
                        <h4>Cast</h4>
                        <VerticalCarouselCast className="elementInfoPage__castContainer" key={"castCarousel"} elements={cast}></VerticalCarouselCast>
                    </div>
                    <div className="elementInfoPage-centerInfo">
                        <img className="elementInfoPage-bgImages" src={backdropImageWithLanguage} key={"element"} alt="bgInfoElementPage"/>
                        <div className="elementInfoPage-centerContent">
                            <div className="elementInfoPage-videoTime">
                            {
                                elementLastTime ?
                                <>
                                    <div className="elementInfoPage-currentTime">{formatTime(elementLastTime)}</div>
                                    <div className="elementInfoPage-sliderTime"><div className="elementInfoPage-time" style={{ width: `${elementLastTime*100/elementTimeLenght}%` }}></div></div>
                                    <div className="elementInfoPage-durationTime">{formatTime(elementTimeLenght)}</div>
                                </>
                                : ""
                            }
                            </div>
                            <div className="centerInfo-container">
                                <img src={logo} key={"element"} alt="elementLogo"/>
                                <div className="centerInfo-btns">
                                    <Link to={"/watch/" + elementName + `/${btoa(`type=${elementType}&season=${lastSeason}&episode=${lastEpisode}`)}`} className="centerInfo-playBtn">Riproduci{seasonEpisodeString}</Link>
                                    <button ref={toWatchBtn} className="centerInfo-controlsBtn toWatchBtn" onClick={() => { toggleToWatchList(elementName); }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 22h-24v-14h7.262c1.559 0 2.411-.708 5.07-3h11.668v17zm-16.738-16c.64 0 1.11-.271 2.389-1.34l-2.651-2.66h-7v4h7.262z"/></svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 17h-3v-3h-2v3h-3v2h3v3h2v-3h3v-2zm-10 5h-14v-20h7c1.695 1.942 2.371 3 4 3h13v7h-2v-5h-11c-2.34 0-3.537-1.388-4.916-3h-4.084v16h12v2z"/></svg>
                                    </button>
                                    <button ref={favouriteBtn} className="centerInfo-controlsBtn favouriteBtn" onClick={() => { toggleFavouriteList(elementName); }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"/></svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.653 19.415c-1.162 1.141-2.389 2.331-3.653 3.585-6.43-6.381-12-11.147-12-15.808 0-4.005 3.098-6.192 6.281-6.192 2.197 0 4.434 1.042 5.719 3.248 1.279-2.195 3.521-3.238 5.726-3.238 3.177 0 6.274 2.171 6.274 6.182 0 1.269-.424 2.546-1.154 3.861l-1.483-1.484c.403-.836.637-1.631.637-2.377 0-2.873-2.216-4.182-4.274-4.182-3.257 0-4.976 3.475-5.726 5.021-.747-1.54-2.484-5.03-5.72-5.031-2.315-.001-4.28 1.516-4.28 4.192 0 3.442 4.742 7.85 10 13l2.239-2.191 1.414 1.414zm7.347-5.415h-3v-3h-2v3h-3v2h3v3h2v-3h3v-2z"/></svg>
                                    </button>
                                    <button ref={likedBtn} className="centerInfo-controlsBtn likeBtns" onClick={() => { setLike(elementName); }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.216 8h-2.216v-1.75l1-3.095v-3.155h-5.246c-2.158 6.369-4.252 9.992-6.754 10v-1h-8v13h8v-1h2l2.507 2h8.461l3.032-2.926v-10.261l-2.784-1.813zm.784 11.225l-1.839 1.775h-6.954l-2.507-2h-2.7v-7c3.781 0 6.727-5.674 8.189-10h1.811v.791l-1 3.095v4.114h3.623l1.377.897v8.328z"/></svg>
                                    </button>
                                    <button ref={unLikedBtn} className="centerInfo-controlsBtn likeBtns" onClick={() => { setUnLike(elementName); }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.216 8h-2.216v-1.75l1-3.095v-3.155h-5.246c-2.158 6.369-4.252 9.992-6.754 10v-1h-8v13h8v-1h2l2.507 2h8.461l3.032-2.926v-10.261l-2.784-1.813zm.784 11.225l-1.839 1.775h-6.954l-2.507-2h-2.7v-7c3.781 0 6.727-5.674 8.189-10h1.811v.791l-1 3.095v4.114h3.623l1.377.897v8.328z"/></svg>
                                    </button>
                                    <button ref={muteBtn} className={`centerInfo-controlsBtn muteBtn ${mutedClass}`} onClick={() => { toggleMute() }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 24"><path d="M18.45,0,15.22,4,8,8v2.29l3.84-2.14L6,15.35V8H1V18H3.84L0,22.73,1.55,24,20,1.27ZM4,16H3V10H4ZM17,7.36V23L8.25,18.14l1.28-1.58,5.47,3V9.82Z"/></svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 9v6h-1v-6h1zm13-7l-9 5v2.288l7-3.889v13.202l-7-3.889v2.288l9 5v-20zm6.416 2.768l-4.332 2.5 1 1.732 4.332-2.5-1-1.732zm-17.416 2.232h-5v10h5v-10zm19 4h-5v2h5v-2zm-4.916 4l-1 1.732 4.332 2.5 1-1.732-4.332-2.5z"/></svg>
                                    </button>
                                    <Link to={"/catalog"} className="centerInfo-controlsBtn">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
                                    </Link>
                                </div>
                                <div className="centerInfo-description">
                                    <h4>Descrizione</h4>
                                    <p>{plot}</p>
                                </div>
                                {
                                    elementType === "Series" ? <EpisodesList element={element} activeEpisode={lastEpisode} activeSeason={lastSeason}></EpisodesList> : <></>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="elementInfoPage-generalInfo">
                        <img src={backdropImageWithLanguage} className="elementInfoPage-bgImages" key={"element"} alt="bgInfoElementPage"/>
                        <div className="generalInfo-block">
                            <div className="generalInfo-info">
                                <h4>rate</h4>
                                <CircularProgressbar styles={buildStyles(circularRateStyle)} strokeWidth={5} background={true} value={voteAverage} maxValue={10} text={`${voteAverage}`} />
                            </div>
                            <div className="generalInfo-info">
                                <h4>anno</h4>
                                <p>{releaseDate[2] + "/" + releaseDate[1] + "/" + releaseDate[0]}</p>
                            </div>
                            <div className="generalInfo-info">
                                <h4>durata</h4>
                                <p>{elementDuration}</p>
                            </div>
                            <div className="generalInfo-info">
                                <h4>Generi</h4>
                                {
                                    genres.map((element, index) =>
                                    {
                                        if(genresCount < maxGenres && element.length < 12)
                                        {
                                            genresCount++;
                                            return(<p key={element + "_" + index}>{element}</p>);
                                        }
                                    })
                                }
                            </div>
                            {
                                getProductionBlock()
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    else
    {
        let loader = document.querySelector(".loader")
        if(loader != null)
        {
            loader.classList.add("loader--visible")
        }

        return(<></>);
    }
}

export default ElementInfoPage;