import React, { useEffect, useState, useRef } from "react";
import { getFirestore, updateDoc, doc, getDoc, arrayUnion, arrayRemove, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from 'react-router-dom';
import axios from "axios";
import BackgroundImage from "../components/backgroundImage";
import VerticalCarousel from "../components/verticalCarousel";

function HeroPage()
{
    const [dataHero, setDataHero] = useState([]);
    const [firstElementData, setfisrtElementData] = useState([]);
    const [userData, setUserData] = useState();

    const [favouriteStatus, setFavouriteStatus] = useState(false);
    const [toWatchStatus, setToWatchStatus] = useState(false);

    const toWatchBtn = useRef();
    const favouriteBtn = useRef();

    const getHeroData = async () =>
    {
        try
        {
            const response = await axios.get('/api/randomElementsData');
            setDataHero(response);
        }
        catch (error)
        {
            console.log(error);
        }
    }

    const changeFirstElementData = (elementData) =>
    {
        if(elementData != null)
        {
            setfisrtElementData(elementData);
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
                    setFavouriteStatus(true);
                    favouriteBtn.current.classList.add("active");
                }
                else
                {
                    setFavouriteStatus(false);
                    favouriteBtn.current.classList.remove("active");
                }
            }
            else
            {
                setFavouriteStatus(false);
                favouriteBtn.current.classList.remove("active");
            }

            if(docSnap.data().toWatch != null)
            {
                if(docSnap.data().toWatch.includes(elementName))
                {
                    setToWatchStatus(true);
                    toWatchBtn.current.classList.add("active");
                }
                else
                {
                    setToWatchStatus(false);
                    toWatchBtn.current.classList.remove("active");
                }
            }
            else
            {
                setToWatchStatus(false);
                toWatchBtn.current.classList.remove("active");
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
                setFavouriteStatus(true);
            }
            else
            {
                await setDoc(docRef,
                {
                    favourites: arrayUnion(element)
                });

                favouriteBtn.current.classList.add("active");
                setFavouriteStatus(true);
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
                setFavouriteStatus(false);
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
                setToWatchStatus(true);
            }
            else
            {
                await setDoc(docRef,
                {
                    toWatch: arrayUnion(element)
                });

                toWatchBtn.current.classList.add("active");
                setToWatchStatus(true);
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
                setToWatchStatus(false);
            }
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
        getHeroData();
    },[]);

    if(dataHero.status === 200 && userData != null)
    {
        let loader = document.querySelector(".loader")
        if(loader != null)
        {
            loader.classList.remove("loader--visible")
        }

        const { title, elementName, elementType, voteAverage, releaseDate, elementDuration, backdropImageWithLanguage, logo } = firstElementData;

        const elementStringDuration = elementType === "Film" ? 'durata' : 'stagioni';
        let verticalElementName = title;

        let logoElementKey = "logo_" + elementName;

        let releaseDateNewKey = "releaseDateNew_" + elementName;
        let elementDurationNewKey = "elementDurationNew_" + elementName;
        let voteAverageNewKey = "voteAverageNew_" + elementName;

        let verticalHeroText = "verticalHeroText_" + elementName;

        getUserPreference(elementName);

        return(
            <div className="hero">
                <BackgroundImage dataImage={ backdropImageWithLanguage } elementName={ firstElementData.elementName }></BackgroundImage>
                <div className="hero__container">
                    <div className="hero--carousel">
                        <VerticalCarousel elements={ dataHero.data } changeFirstElementData={changeFirstElementData}></VerticalCarousel>
                    </div>
                    <div className="hero--elementInfo">
                        <div className="elementInfo--year">
                            <h4>anno</h4>
                            <p>
                                <span key={releaseDateNewKey}>{releaseDate != null ? releaseDate[0] : ""}</span>
                            </p>
                        </div>
                        <div className="elementInfo--duration">
                            <h4>{elementStringDuration}</h4>
                            <p>
                                <span key={elementDurationNewKey}>{elementDuration}</span>
                            </p>
                        </div>
                        <div className="elementInfo--rait">
                            <h4>voto</h4>
                            <p>
                                <span key={voteAverageNewKey}>{voteAverage}</span>
                            </p>
                        </div>
                    </div>
                    <div className="hero--center">
                        <div className="hero--favouriteBtn">
                            <div ref={favouriteBtn} className="favourite--btn" onClick={() => { toggleFavouriteList(elementName); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"/></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.653 19.415c-1.162 1.141-2.389 2.331-3.653 3.585-6.43-6.381-12-11.147-12-15.808 0-4.005 3.098-6.192 6.281-6.192 2.197 0 4.434 1.042 5.719 3.248 1.279-2.195 3.521-3.238 5.726-3.238 3.177 0 6.274 2.171 6.274 6.182 0 1.269-.424 2.546-1.154 3.861l-1.483-1.484c.403-.836.637-1.631.637-2.377 0-2.873-2.216-4.182-4.274-4.182-3.257 0-4.976 3.475-5.726 5.021-.747-1.54-2.484-5.03-5.72-5.031-2.315-.001-4.28 1.516-4.28 4.192 0 3.442 4.742 7.85 10 13l2.239-2.191 1.414 1.414zm7.347-5.415h-3v-3h-2v3h-3v2h3v3h2v-3h3v-2z"/></svg>
                            </div>
                        </div>
                        <div className="centerColumn">
                            <div className="centerColumn--logo">
                                <svg viewBox="0 0 1463.25 1132.51">
                                    <path d="M1071,540.9c-1,281.64-226.85,508.76-508.46,511.14C283.06,1054.41,44,828.2,47.48,533.59,50.77,255.07,277.63,28.92,560.79,29.51,839.89,30.08,1070.76,255.65,1071,540.9ZM563.22,1040.39c277.12-3.45,495.85-227.17,496.2-499.08C1059.77,264.33,835.28,41.69,561,41c-282.36-.74-501.63,228.86-502,498.66C58.53,814.44,282.79,1042,563.22,1040.39Z" transform="translate(118.56 -29.51)"/>
                                    <path d="M560.5,90.11c248.6.82,451.29,202.08,449.63,454.52C1008.53,788.25,812.49,987,567.31,991,310.27,995.08,108,787.9,108.73,539.18,109.45,293.62,308.81,90,560.5,90.11Zm-.83,540.11c1.88-.89,3.11-1.42,4.29-2,15-7.94,30-16,45-23.78,2.69-1.39,3.61-3,3.61-6q-.17-102.5-.12-205V389c1.75.9,2.85,1.43,3.91,2,21.34,12,42.66,24,64.05,35.87,2.59,1.44,3.63,3,3.63,6.06q-.2,62.6-.11,125.17v4.35c1.56-.79,2.56-1.25,3.53-1.77,14.28-7.7,28.53-15.48,42.88-23,2.45-1.3,3.24-2.76,3.22-5.49-.12-23.23-.07-46.47-.08-69.7v-4.26c1.33.66,2,1,2.64,1.31,17.25,9.84,34.66,19.39,51.65,29.65a106.37,106.37,0,0,1,20.08,15.47C823.26,520,828.7,538.25,820.05,559c-5.58,13.4-15.35,23.71-27.86,31-30.89,17.9-62,35.47-93,53.18-1.22.69-2.41,1.43-3.61,2.14l.18,1.5c11.85,1.34,23.67,3.06,35.55,3.94,17.65,1.31,35.19-.46,52.68-2.85,32.7-4.46,64.4-12.39,94.29-26.79q58.51-28.2,117.13-56.19a4.43,4.43,0,0,0,2.93-4.48,440.52,440.52,0,0,0-11.16-119.71c-16.54-70.78-49.09-133.43-96.77-188.22A438.21,438.21,0,0,0,592.79,103.08a444.05,444.05,0,0,0-97.95,3.55A437.08,437.08,0,0,0,219.32,263.47q-83.86,102.82-96.95,235a432,432,0,0,0,6,126c1,5.15,2.21,10.27,3.21,14.86,13-8.92,25.3-18.09,38.29-26.22C201,593.64,234.48,579.05,269,566.7c29.07-10.39,58.78-17.7,89.62-20,5.3-.4,5.32-.3,5.32-5.45q0-94.62,0-189.25c0-4.74.07-9.5.5-14.22,1.14-12.66,4.55-24.64,12.79-34.59,12.41-15,34.07-22.93,57.16-14.69,2.94,1.05,4,2.32,4,5.5q-.15,198.8-.11,397.61v4.54c1.81-.84,3-1.36,4.2-2,13.82-7.23,27.58-14.59,41.5-21.65,3.15-1.6,4.05-3.49,4.05-6.9q-.13-171.83-.07-343.65c0-1.27.15-2.55.25-4.2,1.54.8,2.54,1.28,3.5,1.82C513.35,331.73,535,344,556.7,356c2.6,1.44,3.31,3.08,3.31,5.89q-.25,131.55-.34,263.08ZM364.23,558a42,42,0,0,0-5.65,0c-13.82,2.06-27.85,3.27-41.4,6.51a493.89,493.89,0,0,0-137.43,56.05,270.83,270.83,0,0,0-42.29,30.25c-1.7,1.51-2.26,2.86-1.62,5.13Q173,788.84,278.62,877.61c62.61,52.44,134.71,84.52,215.45,97.06,31.36,4.88,62.9,5.74,94.55,3.83A422,422,0,0,0,668,966a432.91,432.91,0,0,0,126.87-55.08q88-56.37,141.88-145.88A434.24,434.24,0,0,0,994.2,604.32c1.34-9,2.22-18,3.36-27.39-1.15.43-1.75.59-2.29.86-27.29,13.21-54.48,26.64-81.9,39.6-18,8.52-36.18,16.93-54.68,24.37-25,10.07-51.44,14.84-78.11,18.38-32.71,4.35-65,3.15-97-5.13a9.37,9.37,0,0,0-6.25.76c-22.37,12.42-44.74,24.84-66.91,37.61C560.19,722.3,510.2,751.56,459.91,780.3a141.22,141.22,0,0,1-28.39,12.3c-26.71,8.22-49.68-2.5-60.84-27.44-5.12-11.43-6.28-23.54-6.29-35.86q-.08-83.55-.16-167.12Zm62.49,157.15v-5.29q0-181.77,0-363.52c0-15-.05-30,.07-45,0-2.46-.67-3.44-3.18-3.87-15.21-2.59-28.08,1.56-37.82,13.58-8.44,10.43-10.25,23.09-10.26,36q-.07,87.51,0,175,.07,106.07.25,212.11c0,9.57,1.34,19,5.83,27.6,8.27,15.85,21.17,24.44,39.7,21.38,11.38-1.88,21.74-6.5,31.63-12.17Q550.3,715.3,647.55,659.41,713.69,621.54,780,584c8.89-5,16.93-11,23.31-19.09,11.87-15.15,12.2-32.25.5-47.48a68.73,68.73,0,0,0-20.52-17.83q-17.22-9.87-34.48-19.68c-1-.58-2.1-1.07-3.78-1.91v5c0,18.74,0,37.48.08,56.21a5.09,5.09,0,0,1-3.09,5.25C720.17,556,698.4,567.72,676.6,579.37c-1.17.63-2.38,1.18-4.05,2v-5q0-68.39.07-136.78c0-2.92-.9-4.41-3.42-5.8-13.89-7.65-27.67-15.5-41.49-23.27-1.11-.63-2.26-1.18-3.77-2v4.06q0,96.31.08,192.62c0,3.06-1,4.59-3.63,6-22.76,12-45.43,24.11-68.13,36.19-1.17.62-2.39,1.17-4,2V644.1q0-137.91.15-275.82c0-2.76-.9-4.17-3.28-5.49C531,355,517,347,503,339.05c-1-.58-2.09-1.1-3.61-1.91v4.74q0,165.65.08,331.29c0,3-.91,4.63-3.61,6C474,690.51,452.29,702,430.52,713.41,429.45,714,428.33,714.42,426.72,715.17Z" transform="translate(118.56 -29.51)"/>
                                </svg>
                            </div>
                            <div className="centerColumn--elementLogo">
                                <img src={logo} key={logoElementKey} alt="elementLogo"/>
                            </div>
                            <div className="centerColumn--play">
                                <Link to={"/watch/" + elementName + `/${btoa(`type=${elementType}&season=${1}&episode=${1}`)}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 3.532l14.113 8.468-14.113 8.468v-16.936zm-2-3.532v24l20-12-20-12z"/></svg>
                                </Link>
                            </div>
                        </div>
                        <div className="hero--listBtn">
                            <div ref={toWatchBtn} className="list--btn" onClick={() => { toggleToWatchList(elementName); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 22h-24v-14h7.262c1.559 0 2.411-.708 5.07-3h11.668v17zm-16.738-16c.64 0 1.11-.271 2.389-1.34l-2.651-2.66h-7v4h7.262z"/></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 17h-3v-3h-2v3h-3v2h3v3h2v-3h3v-2zm-10 5h-14v-20h7c1.695 1.942 2.371 3 4 3h13v7h-2v-5h-11c-2.34 0-3.537-1.388-4.916-3h-4.084v16h12v2z"/></svg>
                            </div>
                        </div>
                    </div>
                    <div className="hero--elementText">
                        <div className="elementText--vertical">
                            <p key={verticalHeroText}>
                                <span>{verticalElementName}</span>
                                <span>{verticalElementName}</span>
                                <span>{verticalElementName}</span>
                                <span>{verticalElementName}</span>
                                <span>{verticalElementName}</span>
                                <span>{verticalElementName}</span>
                                <span>{verticalElementName}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
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

export default HeroPage;