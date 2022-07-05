import React, { useEffect, useState, useRef } from "react";
import {publicIp, publicIpv4, publicIpv6} from 'public-ip';
import { getFirestore, updateDoc, doc, getDoc, arrayUnion, setDoc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useParams, useNavigate } from "react-router-dom";
import { VideoSeekSlider } from "react-video-seek-slider";
import { Tooltip, Slider } from '@mui/material';
import ReactPlayer from 'react-player/lazy';
import axios from "axios";
import "react-video-seek-slider/styles.css";
import EpisodesListVideoPlayer from '../components/episodesListVideoPlayer';

function VideoPlayer(props)
{
    const history = useNavigate();
    const { elementId, videodata } = useParams();
    const urlParams = new URLSearchParams(atob(videodata));
    const elementType = urlParams.get('type');

    const [eventsStatus, setEventsStatus] = useState(false);

    const [userData, setUserData] = useState();
    const [elementData, setElementData] = useState([]);
    const [seasonsData, setSeasonsData] = useState();
    const [videoLenght, setVideoLenght] = useState();
    const [currentTime, setCurrentTime] = useState();
    const [bufferedProgress, setBufferedProgress] = useState([]);
    const [volume, setVolume] = useState(1);

    const [season, setSeason] = useState(urlParams.get('season'));
    const [episode, setEpisode] = useState(urlParams.get('episode'));

    const sideMenu = useRef();
    const videoPlayerNode = useRef();
    const videoPlayer = useRef();
    const videoControls = useRef();
    const exitVideoPlayerBtn = useRef();

    var publicIp = "";
    var currentPublicIp = "";
    var sideMenuStatus = false;

    const getCurrentDateTime = () =>
    {
        let today = new Date();
        let date = today.getFullYear() + '-' + today.getDate() + '-' + (today.getMonth() + 1);
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date + ' ' + time;

        return(dateTime);
    }

    const getSeasonsData = async () =>
    {
        try
        {
            const response = await axios.post('/api/getSeasonsData', { params:{ elementName: elementId } });
            setSeasonsData(response.data);
        }
        catch (error)
        {
            console.log(error);
        }
    }

    const getElementData = async () =>
    {
        try
        {
            const response = await axios.post('/api/getElementInfo', { params:{ elementName: elementId } });
            setElementData(response);

            getSeasonsData();
        }
        catch (error)
        {
            console.log(error);
        }
    }

    const checkSeasons = () =>
    {
        let tempSeason = parseInt(season);
        let tempEpisode = parseInt(episode);
        let currentSeasonLenght;

        seasonsData.forEach(seasonObj =>
        {
            if(parseInt(seasonObj.seasonNumber) === parseInt(tempSeason))
            {
                currentSeasonLenght = seasonObj.seasonLenght;
            }
        });

        if(tempEpisode + 1 > currentSeasonLenght)
        {
            if(tempSeason + 1 > seasonsData.length)
            {
                return({newEpisode: 1, newSeason: 1});
            }
            else
            {
                tempSeason++;
                return({newEpisode: 1, newSeason: tempSeason});
            }
        }
        else
        {
            tempEpisode++;
            return({newEpisode: tempEpisode, newSeason: tempSeason});
        }
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

    let controlsTimeout;

    const displayControls = () =>
    {
        clearTimeout(controlsTimeout);

        if(videoControls.current != null && exitVideoPlayerBtn.current != null)
        {
            videoControls.current.classList.add("show");
            exitVideoPlayerBtn.current.classList.add("show");
            document.body.style.cursor = "auto";

            controlsTimeout = setTimeout(() =>
            {
                videoControls.current.classList.remove("show");
                exitVideoPlayerBtn.current.classList.remove("show");
                document.body.style.cursor = "none";
            }, 2500);
        }
    };

    window.addEventListener('mousemove', () =>
    {
      displayControls();
    });

    const toggleSeekerSlider = (status) =>
    {
        if (videoPlayerNode.current != null)
        {
            let videoContainer = videoPlayerNode.current;

            if(status === true)
            {
                videoContainer.classList.add("tooltipVolume");
            }
            else
            {
                videoContainer.classList.remove("tooltipVolume");
            }
        }
    }

    const toggleFullScreen = () =>
    {
        if(videoPlayerNode.current != null)
        {
            const video = videoPlayerNode.current;

            if (!document.fullscreenElement)
            {
                video.classList.add("fullscreen");

                if (video.requestFullscreen)
                {
                    video.requestFullscreen();
                }
                else if (video.msRequestFullscreen)
                {
                    video.msRequestFullscreen();
                }
                else if (video.mozRequestFullScreen)
                {
                    video.mozRequestFullScreen();
                }
                else if (video.webkitRequestFullscreen)
                {
                    video.webkitRequestFullscreen();
                }
            }
            else
            {
                video.classList.remove("fullscreen");

                document.exitFullscreen();
            }            
        }
    };

    const onChangeCurrentTime = (time) =>
    {
        setCurrentTime(time);
    }

    const changeCurrentTime = (time) =>
    {
        if(videoPlayer.current != null)
        {
            videoPlayer.current.seekTo(time, "seconds");
        }
    }

    const playVideo = () =>
    {
        if(videoPlayerNode.current != null)
        {
            const video = videoPlayerNode.current.querySelector("video");
            video.play();
        }
    }

    const pauseVideo = () =>
    {
        if(videoPlayerNode.current != null)
        {
            const video = videoPlayerNode.current.querySelector("video");
            video.pause();
        }
    }

    const togglePlayPause = (status) =>
    {
        if(videoPlayerNode.current != null)
        {
            let videoContainer = videoPlayerNode.current;

            if(status === true)
            {
                videoContainer.classList.add("onPlay");
            }
            else
            {
                videoContainer.classList.remove("onPlay");
            }
        }
    }

    const changeVolume = (newValue) =>
    {
        let newVolume = newValue/100;
        setVolume(newVolume);

        if(videoPlayerNode.current != null)
        {
            let videoContainer = videoPlayerNode.current;

            if(newVolume === 0)
            {
                videoContainer.classList.add("muted"); 
            }
            else
            {
                videoContainer.classList.remove("muted");
            }
        }
    };

    if(eventsStatus !== true)
    {
        setEventsStatus(true);

        document.addEventListener("keydown", function(e)
        {
            if(e.keyCode === 32)
            {
                if(videoPlayerNode.current != null)
                {
                    const video = videoPlayerNode.current.querySelector("video");

                    if(video.paused)
                    {
                        playVideo();
                    }
                    else
                    {
                        pauseVideo();
                    }
                }
            } 

            if(e.keyCode === 37)
            {
                if(videoPlayerNode.current != null)
                {
                    const video = videoPlayerNode.current.querySelector("video");
                    let newTime = video.currentTime > 10 ? video.currentTime - 10 : 0;
                    
                    changeCurrentTime(newTime);
                    displayControls();
                }
            }

            if(e.keyCode === 39)
            {
                if(videoPlayerNode.current != null)
                {
                    const video = videoPlayerNode.current.querySelector("video");
                    let newTime = video.currentTime < video.duration - 10 ? video.currentTime + 10 : video.duration;
                    
                    changeCurrentTime(newTime);
                    displayControls();
                }
            }

            if(e.keyCode === 38)
            {
                if(videoPlayerNode.current != null)
                {
                    const video = videoPlayerNode.current.querySelector("video");
                    let newVolume = video.volume + 0.20;
                    
                    if(newVolume > 1)
                    {
                        newVolume = 1;
                    }
                    
                    changeVolume(Math.trunc(newVolume*100));
                }
            }

            if(e.keyCode === 40)
            {
                if(videoPlayerNode.current != null)
                {
                    const video = videoPlayerNode.current.querySelector("video");
                    let newVolume = video.volume > 0.20 ? video.volume - 0.20 : 0;
                    
                    changeVolume(Math.trunc(newVolume*100));
                }
            }
        });
    }

    const openMenu = () =>
    {
        if(sideMenuStatus)
        {
            sideMenuStatus = false;
            sideMenu.current.classList.remove("active");
        }
        else
        {
            sideMenuStatus = true;
            sideMenu.current.classList.add("active");
        }
    }

    const toggleLoader = (status) =>
    {
        let loaderVideo = document.querySelector(".videoPlayer .loader");

        if(status)
        {
            loaderVideo.classList.add("loader--visible");
        }
        else
        {
            loaderVideo.classList.remove ("loader--visible");
        }
    }

    const changeSeasonAndEpisode = (seasonNumber, episodeNumber) =>
    {
        setSeason(seasonNumber);
        setEpisode(episodeNumber);

        window.history.replaceState(null, "New Page Title", "/watch/" + elementId + `/${btoa(`type=${elementType}&season=${seasonNumber}&episode=${episodeNumber}`)}`);
    }

    const checkTime = async (time) =>
    {
        const currentVideoTime = time.playedSeconds * 100;
        const currentPercent = currentVideoTime/videoLenght;

        const db = getFirestore();

        let docRef = doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements`, elementId);
        let docSnap = await getDoc(docRef);

        if(currentPercent > 3)
        {
            if(currentPercent > 95)
            {
                if(elementType.toLowerCase() === "series")
                {
                    if (docSnap.exists())
                    {
                        await updateDoc(doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements`, elementId),
                        {
                            lastSeason: parseInt(checkSeasons().newSeason),
                            lastEpisode: parseInt(checkSeasons().newEpisode),
                            lastTime: getCurrentDateTime(),
                        });

                        docRef = doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements/${elementId}/season_${season}/episode_${episode}`);
                        docSnap = await getDoc(docRef);
                        if (docSnap.exists())
                        {

                            await deleteDoc(doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements/${elementId}/season_${season}`, `episode_${episode}`));

                            docRef = doc(db, `Users/user_${userData.uid}/watched/${elementType.toLowerCase()}/elements/${elementId}`);
                            docSnap = await getDoc(docRef);

                            if (docSnap.exists())
                            {
                                await updateDoc(doc(db, `Users/user_${userData.uid}/watched/${elementType.toLowerCase()}/elements/${elementId}`),
                                {
                                    ["season_" + season]: arrayUnion(parseInt(episode)),
                                });
                            }
                            else
                            {
                                await setDoc(doc(db, `Users/user_${userData.uid}/watched/${elementType.toLowerCase()}/elements`, elementId),
                                {
                                    ["season_" + season]: arrayUnion(parseInt(episode)),
                                });
                            }
                        }
                    }
                }
                else
                {
                    if (docSnap.exists())
                    {
                        try
                        {
                            await deleteDoc(doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements`, elementId));

                            docRef = doc(db, `Users/user_${userData.uid}/watched/${elementType.toLowerCase()}`);
                            docSnap = await getDoc(docRef);

                            if (docSnap.exists())
                            {
                                await updateDoc(doc(db, `Users/user_${userData.uid}/watched/${elementType.toLowerCase()}`),
                                {
                                    elements: arrayUnion(elementId),
                                });
                            }
                        }
                        catch (error)
                        {
                            console.log("Error");
                        }
                    }
                }
            }
            else
            {
                if(elementType.toLowerCase() === "series")
                {
                    if (docSnap.exists())
                    {
                        await updateDoc(doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements`, elementId),
                        {
                            lastSeason: parseInt(season),
                            lastEpisode: parseInt(episode),
                            lastTime: getCurrentDateTime(),
                        });

                        docRef = doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements/${elementId}/season_${season}/episode_${episode}`);
                        docSnap = await getDoc(docRef);
                        if (docSnap.exists())
                        {
                            await updateDoc(doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements/${elementId}/season_${season}`, `episode_${episode}`),
                            {
                                lastSeconds: time.playedSeconds,
                                totalTime: videoLenght,
                                lastTime: getCurrentDateTime(),
                            });
                        }
                        else
                        {
                            await setDoc(doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements/${elementId}/season_${season}`, `episode_${episode}`),
                            {
                                lastSeconds: time.playedSeconds,
                                totalTime: videoLenght,
                                lastTime: getCurrentDateTime(),
                            });
                        }
                    }
                    else
                    {
                        await setDoc(doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements`, elementId),
                        {
                            lastSeason: parseInt(season),
                            lastEpisode: parseInt(episode),
                            lastTime: getCurrentDateTime(),
                        });

                        await setDoc(doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements/${elementId}/season_${season}`, `episode_${episode}`),
                        {
                            lastSeconds: time.playedSeconds,
                            totalTime: videoLenght,
                            lastTime: getCurrentDateTime(),
                        });
                    }
                }
                else
                {
                    if (docSnap.exists())
                    {
                        await updateDoc(doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements`, elementId),
                        {
                            lastSeconds: time.playedSeconds,
                            totalTime: videoLenght,
                            lastTime: getCurrentDateTime(),
                        });
                    }
                    else
                    {
                        await setDoc(doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements`, elementId),
                        {
                            lastSeconds: time.playedSeconds,
                            totalTime: videoLenght,
                            lastTime: getCurrentDateTime(),
                        });
                    }
                }
            }
        }
    }

    const setLastTime = async () =>
    {
        const db = getFirestore();

        let docRef = doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements/${elementId}`);
        let docSnap = await getDoc(docRef);

        if(elementType.toLowerCase() === "series")
        {
            if (docSnap.exists())
            {
                docRef = doc(db, `Users/user_${userData.uid}/watching/${elementType.toLowerCase()}/elements/${elementId}/season_${season}/episode_${episode}`);
                docSnap = await getDoc(docRef);

                if (docSnap.exists())
                {
                    changeCurrentTime(docSnap.data().lastSeconds);
                }
            }
        }
        else
        {
            if (docSnap.exists())
            {
                changeCurrentTime(docSnap.data().lastSeconds);
            }
        }
    }

    const getCurrentPublicIp = async () =>
    {
        return await publicIpv4();
    }

    const getPublicIp = async () =>
    {
        try
        {
            const response = await axios.get('/api/getIp');
            return response.data.ip;
        }
        catch (error)
        {
            console.log(error);
        }
    }

    const auth = getAuth();
    onAuthStateChanged(auth, (user) =>
    {
        if(user)
        {
            setUserData(auth.currentUser);

            currentPublicIp = getCurrentPublicIp();
            publicIp = getPublicIp();
        }
    });
    
    useEffect(()=>
    {
        getElementData();
    },[]);

    useEffect(()=>
    {
    });

    if(elementData.status === 200  && userData != null)
    {
        let loader = document.querySelector(".loader");
        
        if(loader != null)
        {
            loader.style.width = "83.333%";
            loader.classList.remove("loader--visible")
        }

        const { videoPath, title } = elementData.data;
        let videoUrl = "";

        if(elementType === "Film")
        {
            if(currentPublicIp == publicIp)
            {
                if(videoPath.includes("fanseries"))
                {
                    videoUrl = `https://192.168.1.32/fanseries/${elementType}/${elementId}.mp4`;
                }
                else
                {
                    videoUrl = `https://192.168.1.32/animefan/${elementType}/${elementId}.mp4`;
                }
            }
            else
            {
                videoUrl = `${videoPath}${elementType}/${elementId}.mp4`;
            }
        }
        else
        {
            if(currentPublicIp == publicIp)
            {
                if(videoPath.includes("fanseries"))
                {
                    videoUrl = `https://192.168.1.32/fanseries/${elementType}/${elementId}/Season_${season}/${elementId}_S${season}_${episode}.mp4`;
                }
                else
                {
                    videoUrl = `https://192.168.1.32/animefan/${elementType}/${elementId}/Season_${season}/${elementId}_S${season}_${episode}.mp4`;
                }
            }
            else
            {
                videoUrl = `${videoPath}${elementType}/${elementId}/Season_${season}/${elementId}_S${season}_${episode}.mp4`;
            }
        }

        return(
            <div className="videoPlayer" ref={videoPlayerNode}>
                <ReactPlayer className="videoPlayer__video" ref={videoPlayer} volume={volume} pip={false} url={videoUrl}
                    onStart={() => { setLastTime(); }}
                    onReady={() => { toggleLoader(false); playVideo();}}
                    onError={() => { console.log("Errore video") }}
                    onBuffer={() => { toggleLoader(true); pauseVideo()}}
                    onBufferEnd={() => { toggleLoader(false); playVideo() }}
                    onPlay={ () => { togglePlayPause(true) } }
                    onPause={ () => { togglePlayPause(false) } }
                    onDuration={(time) => { setVideoLenght(time) }}
                    onProgress={ (time) => { onChangeCurrentTime(time.playedSeconds); setBufferedProgress(time.loadedSeconds); checkTime(time); }}
                    onEnded={() => { changeSeasonAndEpisode(1, episode + 1); }}
                />
                <div ref={exitVideoPlayerBtn} className="videoPlayer__exit">
                    <button to={"/catalog"} onClick={() => {history(-1)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
                    </button>
                </div>
                <div ref={videoControls} className="videoPlayer__controls">
                    <div className="videoPlayer__bar">
                        <div className="videoPlayer__times">
                            <div className="videoPlayer__currentTime">{ currentTime != null ? formatTime(currentTime) : "00:00" }</div>
                            <div className="videoPlayer__totalTime">{ currentTime != null ? formatTime(videoLenght - currentTime) : "00:00" }</div>
                        </div>
                        <div className="videoPlayer__slider">
                            <VideoSeekSlider key={"time_" + currentTime} onChange={(time) => { changeCurrentTime(time); }} max={videoLenght} progress={bufferedProgress} currentTime={ currentTime }/>
                        </div>
                    </div>
                    <div className="videoPlayer__buttons">
                        <div className="videoPlayer__playPause">
                            <div className="videoPlayer__play" onClick={() => { playVideo(); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 3.532l14.113 8.468-14.113 8.468v-16.936zm-2-3.532v24l20-12-20-12z"/></svg>
                            </div>
                            <div className="videoPlayer__pause" onClick={() => { pauseVideo(); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18 2v20h-2v-20h2zm-10 0v20h-2v-20h2zm12-2h-6v24h6v-24zm-10 0h-6v24h6v-24z"/></svg>
                            </div>
                        </div>
                        <Tooltip onOpen={() => {toggleSeekerSlider(true)}} onClose={() => {toggleSeekerSlider(false)}} title={<Slider sx={{ height: "100px", margin:"20px 0" }} value={volume*100} onChange={(event) => {changeVolume(event.target.value)}} orientation="vertical" />} placement="top">
                            <div className="videoPlayer__toggleVolume">
                                <div className="videoPlayer__volumeMax" onClick={() => {changeVolume(0)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 9v6h-1v-6h1zm13-7l-9 5v2.288l7-3.889v13.202l-7-3.889v2.288l9 5v-20zm6.416 2.768l-4.332 2.5 1 1.732 4.332-2.5-1-1.732zm-17.416 2.232h-5v10h5v-10zm19 4h-5v2h5v-2zm-4.916 4l-1 1.732 4.332 2.5 1-1.732-4.332-2.5z"/></svg>
                                </div>
                                <div className="videoPlayer__volumeMin" onClick={() => {changeVolume(100)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20.455 0l-3.234 3.984-7.221 4.016v2.288l3.836-2.136-5.844 7.198v-7.35h-4.992v10h2.842l-3.842 4.731 1.545 1.269 18.455-22.731-1.545-1.269zm-14.455 16h-1v-6h1v6zm13-8.642v15.642l-8.749-4.865 1.277-1.573 5.472 3.039v-9.779l2-2.464z"/></svg>
                                </div>
                            </div>
                        </Tooltip>
                        <div className="videoPlayer__title">
                            <p>{elementType === "Series" ? `${title} - S${season}E${episode}` : title}</p>
                        </div>
                        <div className="videoPlayer__menu" onClick={() => { openMenu() }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18.546 3h-13.069l-5.477 8.986v9.014h24v-9.014l-5.454-8.986zm-11.946 2h10.82l4.249 7h-5.083l-3 3h-3.172l-3-3h-5.08l4.266-7zm-4.6 14v-5h4.586l3 3h4.828l3-3h4.586v5h-20zm3-8l.607-1h12.786l.607 1h-14zm12.787-2h-11.572l.606-1h10.359l.607 1zm-1.215-2h-9.144l.607-1h7.931l.606 1z"/></svg>
                        </div>
                        <div className="videoPlayer__toggleFullscreen">
                            <div className="videoPlayer__fullscreen" onClick={() => { toggleFullScreen(); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 9h-2v-5h-7v-2h9v7zm-9 13v-2h7v-5h2v7h-9zm-15-7h2v5h7v2h-9v-7zm9-13v2h-7v5h-2v-7h9z"/></svg>
                            </div>
                            <div className="videoPlayer__exitFullscreen" onClick={() => { toggleFullScreen(); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18 3h2v4h4v2h-6v-6zm6 12v2h-4v4h-2v-6h6zm-18 6h-2v-4h-4v-2h6v6zm-6-12v-2h4v-4h2v6h-6z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div ref={sideMenu} className="sideBar__component">
                    <div className="sideBar__headline">
                        <button onClick={() => {}}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 17h-3v-3h-2v3h-3v2h3v3h2v-3h3v-2zm-10 5h-14v-20h7c1.695 1.942 2.371 3 4 3h13v7h-2v-5h-11c-2.34 0-3.537-1.388-4.916-3h-4.084v16h12v2z"></path></svg>
                        </button>
                        <button onClick={() => { sideMenuStatus = false; sideMenu.current.classList.remove("active"); }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
                        </button>
                    </div>
                    <div className="sideBar__episodes">
                    {
                        elementType === "Series" ? <EpisodesListVideoPlayer element={elementId} season={season - 1} episode={episode} changeSeasonAndEpisode={changeSeasonAndEpisode} /> : <></>
                    }
                    </div>
                </div>
                <div className="loader">
                    <div className="loader__container">
                        <div className="loader__column">
                            <div className="loader__cube"></div>
                        </div>
                        <div className="loader__column">
                            <div className="loader__cube"></div>
                        </div>
                        <div className="loader__column">
                            <div className="loader__cube"></div>
                        </div>
                        <div className="loader__column">
                            <div className="loader__cube"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else
    {
        let loader = document.querySelector(".loader");
        
        if(loader != null)
        {
            loader.style.width = "100%";
            loader.classList.add("loader--visible")
        }

        return(<></>);
    }
}

export default VideoPlayer;