import React, { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import Utilitys from '../classes/classUtilitys';

function Menu()
{
    const history = useNavigate();
    const menuNode = useRef();

    const [activeMenu, setActiveMenu] = useState(false);
    const [activeOption, setActiveOption] = useState("/");

    const auth = getAuth();

    const showOptions = () =>
    {
        if(activeMenu)
        {
            return(
                <>
                    <div className="menu__userImage">
                        <img src="http://www.staynerd.com/wp-content/uploads/2014/11/naruto1.jpg" alt="userImage"/>
                    </div>
                    <Link to={"/profile"} onClick={() => {Utilitys.setCookie("currentOptionMenuActive", "/profile", 0)}} key={"seactionMenu_1"} data-path={"/profile"} className={"menu__option"}>Profilo</Link>
                    <Link to={"/profile"} onClick={() => {Utilitys.setCookie("currentOptionMenuActive", "/profile", 0)}} key={"seactionMenu_2"} data-path={"/profile"} className={"menu__option"}>Profilo</Link>
                    <Link to={"/profile"} onClick={() => {Utilitys.setCookie("currentOptionMenuActive", "/profile", 0)}} key={"seactionMenu_3"} data-path={"/profile"} className={"menu__option"}>Profilo</Link>
                    <Link to={"/profile"} onClick={() => {Utilitys.setCookie("currentOptionMenuActive", "/profile", 0)}} key={"seactionMenu_4"} data-path={"/profile"} className={"menu__option"}>Profilo</Link>
                    <div className="menu__logout" onClick={() => {auth.signOut()}}>Logout</div>
                </>
            );
        }
        else
        {
            return(
                <>
                    <Link to={"/"} onClick={() => {Utilitys.setCookie("currentOptionMenuActive", "/", 0)}} key={"seactionMenu_1"} data-path={"/"} className={"menu__optionFront"}>Home</Link>
                    <Link to={"/catalog"} onClick={() => {Utilitys.setCookie("currentOptionMenuActive", "/catalog", 0)}} key={"seactionMenu_2"} data-path={"/catalog"} className={"menu__optionFront"}>Catalogo</Link>
                    <Link to={"/music"} onClick={() => {Utilitys.setCookie("currentOptionMenuActive", "/music", 0)}} key={"seactionMenu_3"} data-path={"/music"} className={"menu__optionFront"}>Musica</Link>
                    <Link to={"/footer"} onClick={() => {Utilitys.setCookie("currentOptionMenuActive", "/footer", 0)}} key={"seactionMenu_4"} data-path={"/footer"} className={"menu__optionFront"}>Footer</Link>
                </>
            );
        }
    }

    const changeActiveOption = (path) =>
    {
        setActiveOption(path);

        const menu = menuNode.current;
        let optionsMenu;
        
        if(activeMenu)
        {
            optionsMenu = menu.querySelectorAll(".menu__option");
        }
        else
        {
            optionsMenu = menu.querySelectorAll(".menu__optionFront");
        }

        optionsMenu.forEach(option =>
        {
            if(option.dataset.path === path)
            {
                option.classList.add("active");
            }
            else
            {
                option.classList.remove("active");
            }
        });
    }

    useEffect(()=>
    {
        if(Utilitys.getCookie("currentOptionMenuActive") === "")
        {
            Utilitys.setCookie("currentOptionMenuActive", activeOption, 0); //Cookie name; Cookie value; Cookie expire days;
            changeActiveOption("/");

            history("/"); // Return to home
        }
        else
        {
            changeActiveOption(Utilitys.getCookie("currentOptionMenuActive"));
        }
    });

    return(
        <div className="menu" ref={menuNode}>
          <div className="menu__btn" onClick={() => {setActiveMenu(!activeMenu)}}>
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
          <div className="menu__optionsContainer">
            {
                showOptions()
            }
          </div>
        </div>
    );
}

export default Menu;