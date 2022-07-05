import React, { useState, useRef, useEffect } from "react";
import Select from 'react-select';
import axios from "axios";

function AddNewSeason()
{
    const [elementsData, setElementsData] = useState();

    const [elementDataToSend, setElementDataToSend] = useState(new Map());
    const [elementsFromSeasonsOptions, setElementsFromSeasonsOptions] = useState();
    const [elementSeasonsData, setElementSeasonsData] = useState([]);

    const [indexData, setIndexData] = useState();

    const elementsSelect = useRef();
    const inputSeasonNumber = useRef();
    const inputSeasonLength = useRef();

    const getElementsFromSeasons = async () =>
    {
        try
        {
            const results = await axios.get('/api/getElementsListFromSeasons');
            setElementsData(results.data);

            const options = [];

            results.data.forEach((element, index) =>
            {
                options.push({ value: index, label: element.elementName });
            });

            setElementsFromSeasonsOptions(options);

            if(options != null && options.length > 0)
            {
                elementsSelect.current.setValue(options[0]);
            }
        }
        catch (error)
        {
            console.log(error);
        }
    }

    const searchSeasons = async (index) =>
    {
        if(index != null)
        {
            try
            {
                setIndexData(index);

                const results = await axios.post('/api/getSeasonFromElement', { params:{ elementName: elementsData[index].elementName } });
                setElementSeasonsData(results.data);

                setElementDataToSend(elementDataToSend.set("elementName", elementsData[index].elementName));
            }
            catch (error)
            {
                console.log(error);
            }
        }
    }

    const sendNewSeason = async () =>
    {
        if(indexData != null)
        {
            setElementDataToSend(elementDataToSend.set("elementJsonId", elementsData[indexData].jsonData_ID));
            setElementDataToSend(elementDataToSend.set("seasonNumber", inputSeasonNumber.current.value));
            setElementDataToSend(elementDataToSend.set("seasonEpisodeEnd", inputSeasonLength.current.value));

            try
            {
                const results = await axios.post('/api/addNewSeason', { params:{ data: Object.fromEntries(elementDataToSend) } });
                console.log(results.data);

                getElementsFromSeasons();
            }
            catch (error)
            {
                console.log(error);
            }
        }
    }

    useEffect(() =>
    {
        getElementsFromSeasons();
    }, []);
    
    if(elementSeasonsData != null)
    {
        return(
            <div className="adminCDN__container">
                <div className="adminCDN__section">
                    <Select ref={elementsSelect} key={"selectImage"} options={elementsFromSeasonsOptions} onChange={(option) => { searchSeasons(option.value) }} className="select" noOptionsMessage={() => "Nessun risultato"} theme={(theme) => ({...theme, colors: { ...theme.colors, primary25: '#707070', primary: '#BE3D15', }, })}/>
                    {
                        typeof(elementSeasonsData) !== "string" ? elementSeasonsData.map(element =>
                        {
                            const { seasonNumber, seasonEpisodeEnd, videoPath} = element;
                            
                            return(
                                <div className="adminCDN__row" key={`seasonNumber_${seasonNumber}}`}>
                                    <div className="adminCDN__row">
                                        <input type="text" value={seasonNumber} onChange={() => {}}/>
                                        <input type="text" value={seasonEpisodeEnd} onChange={() => {}}/>
                                        <input type="text" value={videoPath} onChange={() => {}}/>
                                    </div>
                                    <button>Update</button>
                                </div>
                            );
                        }) : null
                    }
                    <div className="adminCDN__row three">
                        <input ref={inputSeasonNumber} type="text" value={elementSeasonsData.length + 1} placeholder="Season number" disabled/>
                        <input ref={inputSeasonLength} type="text" placeholder="Season length" required/>
                        <button onClick={() => {sendNewSeason()} }>Insert</button>
                    </div>
                </div>
            </div>
        );
    }
    else
    {
        return(<></>);
    }
}

export default AddNewSeason;