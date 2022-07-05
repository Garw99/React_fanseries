import React, { useState, useEffect } from "react";
import Skeleton from '@mui/material/Skeleton';
import Select from 'react-select';
import axios from "axios";

function EpisodesListVideoPlayer(props)
{
    const [elementData, setElementData] = useState();
    const [activeSeason, setActiveSeason] = useState();
    const [currentSeason, setCurrentSeason] = useState(props.season);
    const [activeEpisode, setActiveEpisode] = useState(props.episode);
    const [episodesList, setEpisodesList] = useState([]);

    const getElementData = async () =>
    {
        try
        {
            const response = await axios.post('/api/getSeasonsFromElement', { params:{ elementName: props.element } });
            setElementData(response);
        }
        catch (error)
        {
            console.log(error);
        }
    }

    const changeSeason = (season) =>
    {
        setActiveSeason(season);

        setEpisodesList(elementData.data.seasons.length > 0 ? elementData.data.seasons[season].episodesData : []);
    }

    useEffect(()=>
    {
        getElementData();
    },[]);

    if(elementData != null && elementData.status === 200)
    {
        let seasonOptions = [];

        if(activeSeason == null)
        {
            changeSeason(props.season);
        }

        if(elementData.data.seasons.length > 0)
        {
            elementData.data.seasons.forEach((season, index) =>
            {
                seasonOptions.push({ value: index, label: "Stagione " + season.seasonNumber});
            });

            return(
                <div className="episodes">
                    <div className="episodes__episodesInfo">
                        <Select key={"selectSeason"} value={seasonOptions[activeSeason]} options={seasonOptions} isClearable={false} isSearchable={false} placeholder="Stagione" onChange={ (seasonOptions) => { changeSeason(seasonOptions.value) } } className="select" noOptionsMessage={() => "Stagione non trovata"} theme={(theme) => ({...theme, colors: { ...theme.colors, primary25: '#707070', primary: '#BE3D15', }, })}/>
                    </div>
                    <div className="episodes__episodesList">
                    {
                        episodesList.length < 0 ? <p>Non ci sono episodi disponibili</p> : 
                        episodesList.map((episode) =>
                        {
                            return(
                                <div className={`episodes__episode ${activeEpisode === episode.episodeNumber && currentSeason === activeSeason ? "active":"" }`} onClick={ () => {props.changeSeasonAndEpisode(activeSeason + 1, episode.episodeNumber); setCurrentSeason(activeSeason); setActiveEpisode(episode.episodeNumber)}} key={ "episode_" + episode.episodeNumber }>
                                    <div className="episodes__episodeImage">
                                        <img src={"https://image.tmdb.org/t/p/w200" + episode.episodeImage} alt="episodeImage"/>
                                    </div>
                                    <div className="episodes__episodeInfo">
                                        <p>Episode { episode.episodeNumber }</p>
                                        <p>43Min</p>
                                    </div>
                                    <div className="episodes__episodeTitle">{ episode.episodeName }</div>
                                </div>
                            );
                        })
                    }
                    </div>
                </div>
            );
        }
        else
        {
            return(
                <div className="episodes">
                    <div className="episodes__episodesInfo">
                        <div className="episodes__noSeasonsAvailable ">Non ci sono stagioni disponibili</div>
                    </div>
                </div>
            );
        }
    }
    else
    {
        return(
            <div className="centerInfo__episodes">
                <div className="centerInfo__episodesInfo">
                    <Skeleton  variant="rectangular" sx={{backgroundColor:"#242424"}} width={"20%"} height={"calc((50/1080) * 100vh)"} className="skeleton" />
                    <Skeleton  variant="rectangular" sx={{backgroundColor:"#242424"}} width={"20%"} height={"calc((50/1080) * 100vh)"} className="skeleton" />
                </div>
                <div className="centerInfo__episodesList">
                    <Skeleton  variant="rectangular" sx={{backgroundColor:"#242424"}} width={"100%"} height={"calc((140/1080) * 100vh)"} className="skeleton" />
                </div>
            </div>
        );
    }
}

export default EpisodesListVideoPlayer;