import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {BrowserView, MobileView} from 'react-device-detect';
import Hero from './sections/hero';
import CatalogPage from './sections/catalogPage';

function App()
{

  const [menuSectionActive, setmenuSectionActive] = useState("home");
  const menuObj = [
      {
          name: "home",
          path: "/",
      },
      {
          name: "catalogo",
          path: "/catalog",
      },
      {
          name: "musica",
          path: "/music",
      },
      {
          name: "footer",
          path: "/footer",
      }
  ];
  
  const setEventOnMenu = () =>
  {
    let menuBtns = document.querySelectorAll(".heroMenuSection a");
    let activeSection = "";

    menuBtns.forEach(element =>
    {
        element.addEventListener("click", (e) =>
        {
            setmenuSectionActive(e.target.dataset.menu);
        });
    });
  }

  const getPageFromDevice = () =>
  {
      return (
          <>
            <BrowserView className="home--content">
              <Routes>
                <Route exact path="/" element={<Hero/>}/>
                <Route path="/catalog" element={<CatalogPage/>}/>
              </Routes>
            </BrowserView>
            <MobileView className="home--content">
              <Routes>
                <Route exact path="/" element={<Hero/>}/>
              </Routes>
            </MobileView>
          </>
      );
  };

  useEffect(() =>
  {
      setEventOnMenu();
  },[menuSectionActive]);

  return (
    <Router>
      <div className="home__container">
          {
            getPageFromDevice()
          }
        <div className="home--menu">
          <div className="menu--btn">
            <svg x="0px" y="0px" viewBox="0 0 32 32">
              <path d="M1,0h6c0.6,0,1,0.4,1,1v6c0,0.6-0.4,1-1,1H1C0.4,8,0,7.6,0,7V1C0,0.4,0.4,0,1,0z"/>
              <path d="M13,0h6c0.6,0,1,0.4,1,1v6c0,0.6-0.4,1-1,1h-6c-0.6,0-1-0.4-1-1V1C12,0.4,12.4,0,13,0z"/>
              <path d="M25,0h6c0.6,0,1,0.4,1,1v6c0,0.6-0.4,1-1,1h-6c-0.6,0-1-0.4-1-1V1C24,0.4,24.4,0,25,0z"/>
              <path d="M1,12h6c0.6,0,1,0.4,1,1v6c0,0.6-0.4,1-1,1H1c-0.6,0-1-0.4-1-1v-6C0,12.4,0.4,12,1,12z"/>
              <path d="M13,12h6c0.6,0,1,0.4,1,1v6c0,0.6-0.4,1-1,1h-6c-0.6,0-1-0.4-1-1v-6C12,12.4,12.4,12,13,12z"/>
              <path d="M25,12h6c0.6,0,1,0.4,1,1v6c0,0.6-0.4,1-1,1h-6c-0.6,0-1-0.4-1-1v-6C24,12.4,24.4,12,25,12z"/>
              <path d="M1,24h6c0.6,0,1,0.4,1,1v6c0,0.6-0.4,1-1,1H1c-0.6,0-1-0.4-1-1v-6C0,24.4,0.4,24,1,24z"/>
              <path d="M13,24h6c0.6,0,1,0.4,1,1v6c0,0.6-0.4,1-1,1h-6c-0.6,0-1-0.4-1-1v-6C12,24.4,12.4,24,13,24z"/>
              <path d="M25,24h6c0.6,0,1,0.4,1,1v6c0,0.6-0.4,1-1,1h-6c-0.6,0-1-0.4-1-1v-6C24,24.4,24.4,24,25,24z"/>
            </svg>
          </div>
          <div className="heroMenuSection">
            {
              menuObj.map((sectionName) =>
              {
                let classActive = "";
                if(sectionName.name === menuSectionActive)
                {
                  classActive = "heroSection--active";
                }
                
                return(
                  <>
                      <Link to={sectionName.path} key={sectionName.name} className={classActive} data-menu={sectionName.name}>{sectionName.name}</Link>
                  </>
                )
              })
            }
          </div>
        </div>
      </div>
    </Router>
  ); 
}

export default App;
