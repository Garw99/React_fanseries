import React, { useState, useRef, useEffect } from "react";
import Select from 'react-select';
import axios from "axios";

function AddNewElement()
{
    const serversOptions = [
        { value: "fanseries", label: "Fanseries" },
        { value: "animefan", label: "Animefan" }
    ];

    const [elementDataToSend, setElementDataToSend] = useState(new Map());

    const [baseElementsData, setBaseElementsData] = useState();
    const [baseElementsOptions, setBaseElementsOptions] = useState();
    const [serchedData, setSerchedData] = useState();
    const [resultsOptions, setResultsOptions] = useState([]);
    const [elementImagesObj, setElementImagesObj] = useState([]);

    const [posterImage, setPosterImage] = useState();
    const [posterOptions, setPosterOptions] = useState();

    const [backdropImage, setBackdropImage] = useState();
    const [backdropOptions, setBackdropOptions] = useState();

    const [backdropImageWithoutLanguage, setBackdropImageWithoutLanguage] = useState();
    const [backdropWithoutLanguageOptions, setBackdropWithoutLanguageOptions] = useState();

    const [logoImage, setLogoImage] = useState();
    const [logoOptions, setLogoOptions] = useState();
    
    const searchElementInput = useRef();
    const selectResultBlock = useRef();

    const serverSelect = useRef();
    const posterSelect = useRef();
    const backdropSelect = useRef();
    const backdropWithoutLanguageSelect = useRef();
    const logoSelect = useRef();
    const baseElementsSelect = useRef();

    const searchBaseElements = async (element) =>
    {
        try
        {
            const results = await axios.get('/api/getBaseElementsList');
            setBaseElementsData(results.data);

            const options = [];

            results.data.forEach((element) =>
            {
                options.push({ value: element, label: element });
            });

            setBaseElementsOptions(options);
        }
        catch (error)
        {
            console.log(error);
        }
    }

    const serchElement = async (element) =>
    {
        try
        {
            const results = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=674e811ea33e95cb12511a7160332d38&language=it-IT&query=${element}&page=1&include_adult=true`);
            setSerchedData(results);

            const options = [];

            results.data.results.forEach((element, index) =>
            {
                if(element.title != null && element.title !== "")
                {
                    options.push({ value: index, label: element.title });
                }
                else
                {
                    options.push({ value: index, label: element.name });
                }
            });

            setResultsOptions(options);

            selectResultBlock.current.setValue(options[0]);
        }
        catch (error)
        {
            console.log(error);
        }
    }

    const searchElementJsons = async (id, elementType) =>
    {
        try
        {
            if(elementType === "Film")
            {
                const images = await axios.get(`https://api.themoviedb.org/3/movie/${id}/images?api_key=674e811ea33e95cb12511a7160332d38&language=it-IT&include_image_language=en,null,it`);
                return(images.data);
            }
            else
            {
                const images = await axios.get(`https://api.themoviedb.org/3/tv/${id}/images?api_key=674e811ea33e95cb12511a7160332d38&language=it-IT&include_image_language=en,null,it`);
                return(images.data);
            }
        }
        catch (error)
        {
            console.log(error);
        }
    }

    const changeData = async (option) =>
    {
        if(option.label !== "")
        {
            setElementDataToSend(elementDataToSend.set('dataId', serchedData.data.results[option.value].id));
            setElementDataToSend(elementDataToSend.set('prettyName', serchedData.data.results[option.value].title != null ? serchedData.data.results[option.value].title : serchedData.data.results[option.value].name));
            setElementDataToSend(elementDataToSend.set('elementName', elementDataToSend.get("prettyName").replace(/[^A-Z0-9]/ig, "")));
            setElementDataToSend(elementDataToSend.set('elementType', serchedData.data.results[option.value].media_type === "tv" ? "Series" : "Film"));

            await searchElementJsons(elementDataToSend.get("dataId"), elementDataToSend.get("elementType")).then((data) =>
            {
                const posterOptionsTemp = [];
                const backdropOptionsTemp = [];
                const backdropWithoutLanguageOptionsTemp = [];
                const logoOptionsTemp = [];
                
                data.posters.forEach((element, index) =>
                {
                    if(element.iso_639_1 !== null)
                    {
                        posterOptionsTemp.push({ value: `https://www.themoviedb.org/t/p/original${element.file_path}`, label: `Poster_${index}_${element.iso_639_1}` });
                    }
                    else
                    {
                        posterOptionsTemp.push({ value: `https://www.themoviedb.org/t/p/original${element.file_path}`, label: `Poster_${index}` });
                    }
                });

                data.backdrops.forEach((element, index) =>
                {
                    if(element.iso_639_1 !== null)
                    {
                        backdropOptionsTemp.push({ value: `https://www.themoviedb.org/t/p/original${element.file_path}`, label: `Backdrop_${index}_${element.iso_639_1}` });
                    }
                });

                data.backdrops.forEach((element, index) =>
                {
                    if(element.iso_639_1 === null)
                    {
                        backdropWithoutLanguageOptionsTemp.push({ value: `https://www.themoviedb.org/t/p/original${element.file_path}`, label: `BackdropNoLanguage_${index}` });
                    }
                });

                data.logos.forEach((element, index) =>
                {
                    logoOptionsTemp.push({ value: `https://www.themoviedb.org/t/p/original${element.file_path}`, label: `Logo_${index}_${element.iso_639_1}` });
                });

                setPosterOptions(posterOptionsTemp);
                setBackdropOptions(backdropOptionsTemp);
                setBackdropWithoutLanguageOptions(backdropWithoutLanguageOptionsTemp);
                setLogoOptions(logoOptionsTemp);

                if(posterOptionsTemp.length > 0)
                {
                    posterSelect.current.setValue(posterOptionsTemp[0]);
                }

                if(backdropOptionsTemp.length > 0)
                {
                    backdropSelect.current.setValue(backdropOptionsTemp[0]);
                }

                if(backdropWithoutLanguageOptionsTemp.length > 0)
                {
                    backdropWithoutLanguageSelect.current.setValue(backdropWithoutLanguageOptionsTemp[0]);
                }

                if(logoOptionsTemp.length > 0)
                {
                    logoSelect.current.setValue(logoOptionsTemp[0]);
                }
            });
        }
    }

    const updatePoster = (option) =>
    {
        if(option != null)
        {
            setElementDataToSend(elementDataToSend.set('elementPoster', option.value));
            setPosterImage(option.value);
        }
    }

    const updateBackdrop = (option) =>
    {
        if(option != null)
        {
            setElementDataToSend(elementDataToSend.set('elementBackdrop', option.value));
            setBackdropImage(option.value);
        }
    }

    const updateBackdropWithoutLanguage = (option) =>
    {
        if(option != null)
        {
            setElementDataToSend(elementDataToSend.set('elementBackdropWithoutLanguage', option.value));
            setBackdropImageWithoutLanguage(option.value);
        }
    }

    const updateLogo = (option) =>
    {
        if(option != null)
        {
            setElementDataToSend(elementDataToSend.set('elementLogo', option.value));
            setLogoImage(option.value);
        }
    }

    const sendNewElement = async () =>
    {
        try
        {
            const response = await axios.post('/api/addNewElement', { params:{ data: Object.fromEntries(elementDataToSend) } });
            searchBaseElements();
            
            console.log(response);
        }
        catch (error)
        {
            console.log(error);
        }
    }

    useEffect(() =>
    {
        searchBaseElements();
        serverSelect.current.setValue(serversOptions[0]);
    }, []);
    
    return(
        <div className="adminCDN__container">
            <div className="adminCDN__section">
                <input ref={searchElementInput} type="text" placeholder="Cerca..."/>
                <Select ref={serverSelect} key={"selectServer"} options={serversOptions} placeholder="Server" onChange={(option) => {setElementDataToSend(elementDataToSend.set('selectedServer', option.value))}} className="select" noOptionsMessage={() => "Server non trovato"} theme={(theme) => ({...theme, colors: { ...theme.colors, primary25: '#707070', primary: '#BE3D15', }, })}/>
                <div className="adminCDN__imagesGrid">
                    <div className="adminCDN__gridBlock">
                        <div className="adminCDN__Image">
                            <img src={posterImage} alt="resultImage" />
                        </div>
                        <Select ref={posterSelect} key={"selectImage"} options={posterOptions} onChange={(option) => { updatePoster(option) }} placeholder="Poster" className="select" noOptionsMessage={() => "Nessun risultato"} theme={(theme) => ({...theme, colors: { ...theme.colors, primary25: '#707070', primary: '#BE3D15', }, })}/>
                    </div>
                    <div className="adminCDN__gridBlock">
                        <div className="adminCDN__Image">
                            <img src={backdropImage} alt="resultImage" />
                        </div>
                        <Select ref={backdropSelect} key={"selectImage"} options={backdropOptions} onChange={(option) => { updateBackdrop(option) }} placeholder="Backdrop" className="select" noOptionsMessage={() => "Nessun risultato"} theme={(theme) => ({...theme, colors: { ...theme.colors, primary25: '#707070', primary: '#BE3D15', }, })}/>
                    </div>
                    <div className="adminCDN__gridBlock">
                        <div className="adminCDN__Image">
                            <img src={backdropImageWithoutLanguage} alt="resultImage" />
                        </div>
                        <Select ref={backdropWithoutLanguageSelect} key={"selectImage"} options={backdropWithoutLanguageOptions} onChange={(option) => { updateBackdropWithoutLanguage(option) }} placeholder="Back no lang" className="select" noOptionsMessage={() => "Nessun risultato"} theme={(theme) => ({...theme, colors: { ...theme.colors, primary25: '#707070', primary: '#BE3D15', }, })}/>
                    </div>
                    <div className="adminCDN__gridBlock">
                        <div className="adminCDN__Image">
                            <img src={logoImage} alt="resultImage" />
                        </div>
                        <Select ref={logoSelect} key={"selectImage"} options={logoOptions} onChange={(option) => { updateLogo(option) }} placeholder="Logo" className="select" noOptionsMessage={() => "Nessun risultato"} theme={(theme) => ({...theme, colors: { ...theme.colors, primary25: '#707070', primary: '#BE3D15', }, })}/>
                    </div>
                </div>
                <Select ref={selectResultBlock} key={"selectResutls"} options={resultsOptions} onChange={(option) => { changeData(option) }} className="select" noOptionsMessage={() => "Nessun risultato"} theme={(theme) => ({...theme, colors: { ...theme.colors, primary25: '#707070', primary: '#BE3D15', }, })}/>
                <div className="adminCDN__row">
                    <Select ref={baseElementsSelect} key={"selectBaseElement"} options={baseElementsOptions} onChange={(option) => { option != null ? setElementDataToSend(elementDataToSend.set('elementBaseName', option.value)):setElementDataToSend(elementDataToSend.set('elementBaseName', "")) }} placeholder="Elemento base" className="select" noOptionsMessage={() => "Nessun risultato"} theme={(theme) => ({...theme, colors: { ...theme.colors, primary25: '#707070', primary: '#BE3D15', }, })}/>
                    <button onClick={() => { baseElementsSelect.current.clearValue(); }}>Clear</button>
                </div>
                <button className="outline" onClick={() => {serchElement(encodeURIComponent(searchElementInput.current.value))}}>Cerca</button>
                <button onClick={() => { sendNewElement(); }}>Aggiungi</button>
            </div>
        </div>
    );
}

export default AddNewElement;