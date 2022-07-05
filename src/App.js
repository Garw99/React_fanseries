import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {BrowserView, MobileView} from 'react-device-detect';
import Authentication from './sections/authentication';
import HeroPage from './sections/heroPage';
import CatalogPage from './sections/catalogPage';
import ElementInfoPage from './sections/elementInfoPage';
import VideoPlayerPage from './sections/videoPlayerPage';
import AddNewElement from './sections/addNewElement';
import AddNewSeason from './sections/addNewSeason';
import Menu from './components/menu';
import Utilitys from './classes/classUtilitys';

import { initializeApp } from "firebase/app";
import MobileHome from "./sections/mobileHome";
import MobileMenu from "./components/mobileMenu";

function App()
{
  const firebaseConfig =
  {
    apiKey: "AIzaSyBGL-jyZEBXttTjXZqRfAUzRVCwKOYraB0",
    authDomain: "fanseries-ccc39.firebaseapp.com",
    projectId: "fanseries-ccc39",
    storageBucket: "fanseries-ccc39.appspot.com",
    messagingSenderId: "925597344711",
    appId: "1:925597344711:web:bac094e9981ff1e4d16fe2",
    measurementId: "G-WKHBD5C8ED"
  };

  const [loginStatus, setLoginStatus] = useState(null);

  const app = initializeApp(firebaseConfig);

  const getUser = async () =>
  {
    const auth = await getAuth();

    onAuthStateChanged(auth, (user) =>
    {
      if(user)
      {
        setLoginStatus(true);
        Utilitys.setCookie("loginStatus", true); //Cookie name; Cookie value; Cookie expire days;
      }
      else
      {
        Utilitys.setCookie("loginStatus", false); //Cookie name; Cookie value; Cookie expire days;
        setLoginStatus(false);
      }
    });
  }

  useEffect(() =>
  {
    getUser();
  });

  if(loginStatus != null)
  {
    if(loginStatus !== false)
    {
      return (
        <Router>
          <div className="home__container">
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
            {
              <>
                <BrowserView className="home--content">
                  <Routes>
                    <Route exact path="/" element={<HeroPage/>}/>
                    <Route path="catalog" element={<CatalogPage/>}/>
                    <Route path="catalog/:elementId" element={<ElementInfoPage></ElementInfoPage>}/>
                    <Route path="watch/:elementId/:videodata" element={<VideoPlayerPage/>} />
                    <Route path="authentication" element={<Authentication/>}></Route>
                    <Route path="admin/addNewElement" element={<AddNewElement/>}></Route>
                    <Route path="admin/addNewSeason" element={<AddNewSeason/>}></Route>
                    <Route path="*" element={<div>Page not found 404</div>}/>
                  </Routes>
                </BrowserView>
                <MobileView className="home--content">
                  <MobileMenu></MobileMenu>
                  <Routes>
                    <Route exact path="/" element={<MobileHome/>}/>
                    <Route path="*" element={<div>Page not found 404</div>}/>
                  </Routes>
                </MobileView>
              </>
            }
            <Menu></Menu>
          </div>
        </Router>
      ); 
    }
    else
    {
      return(
        <Authentication></Authentication>
      );
    }
  }
  else
  {
    return(
      <></>
    );
  }
}

export default App;
