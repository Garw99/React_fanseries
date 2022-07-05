import React, { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from 'react-router-dom';
import axios from "axios";

function MobileHome()
{
    const [userData, setUserData] = useState();

    const auth = getAuth();
    onAuthStateChanged(auth, (user) =>
    {
        if(user)
        {
            setUserData(auth.currentUser);
        }
    });

    return(
        <>
        
        </>
    );
}

export default MobileHome;